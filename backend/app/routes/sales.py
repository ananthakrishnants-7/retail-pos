from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.product import Product
from app.models.sale import Sale, SaleItem
from app.schemas.sale import SaleCreate, SaleResponse


router = APIRouter(
    prefix="/api/sales",
    tags=["Sales"],
)

@router.get(
    "/",
    response_model=list[SaleResponse],
)
def get_sales(
    db: Session = Depends(get_db),
):
    sales = (
        db.query(Sale)
        .order_by(Sale.created_at.desc())
        .all()
    )

    return sales
@router.post(
    "/",
    response_model=SaleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_sale(
    sale_data: SaleCreate,
    db: Session = Depends(get_db),
):
    subtotal = 0
    sale_items = []

    # -------------------------
    # Validate products & stock
    # -------------------------

    for item in sale_data.items:

        product = db.get(Product, item.product_id)

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {item.product_id} not found",
            )

        if not product.is_active:
            raise HTTPException(
                status_code=400,
                detail=f"Product '{product.name}' is inactive",
            )

        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Insufficient stock for '{product.name}'. "
                    f"Available: {product.stock_quantity}"
                ),
            )

        item_subtotal = float(product.price) * item.quantity

        subtotal += item_subtotal

        sale_items.append(
            {
                "product": product,
                "quantity": item.quantity,
                "unit_price": float(product.price),
                "subtotal": item_subtotal,
            }
        )

    # -------------------------
    # Calculate total
    # -------------------------

    total = (
        subtotal
        - sale_data.discount
        + sale_data.tax
    )

    if total < 0:
        raise HTTPException(
            status_code=400,
            detail="Discount cannot exceed subtotal",
        )

    # -------------------------
    # Generate invoice number
    # -------------------------

    invoice_number = (
        f"INV-{datetime.now().strftime('%Y%m%d%H%M%S')}"
    )

    # -------------------------
    # Create sale
    # -------------------------

    sale = Sale(
        invoice_number=invoice_number,
        staff_id=1,
        subtotal=subtotal,
        discount=sale_data.discount,
        tax=sale_data.tax,
        total=total,
        payment_method=sale_data.payment_method.upper(),
        status="COMPLETED",
    )

    db.add(sale)
    db.flush()

    # -------------------------
    # Create sale items
    # & reduce stock
    # -------------------------

    for item in sale_items:

        product = item["product"]

        product.stock_quantity -= item["quantity"]

        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=product.id,
            quantity=item["quantity"],
            unit_price=item["unit_price"],
            subtotal=item["subtotal"],
        )

        db.add(sale_item)

    db.commit()
    db.refresh(sale)

    return sale