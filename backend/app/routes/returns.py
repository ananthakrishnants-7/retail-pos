from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.product import Product
from app.models.sale import Sale, SaleItem
from app.models.return_model import Return, ReturnItem


router = APIRouter(
    prefix="/api/returns",
    tags=["Returns"],
)


class ReturnCreate(BaseModel):
    sale_id: int
    product_id: int
    quantity: int = Field(gt=0)
    reason: str | None = None


class ReturnResponse(BaseModel):
    id: int
    sale_id: int
    product_id: int
    quantity: int
    refund_amount: float
    reason: str | None
    status: str
    created_at: datetime


@router.get("/")
def get_returns(db: Session = Depends(get_db)):
    returns = (
        db.query(Return, ReturnItem)
        .join(ReturnItem, Return.id == ReturnItem.return_id)
        .order_by(Return.created_at.desc())
        .all()
    )

    return [
        {
            "id": ret.id,
            "sale_id": ret.sale_id,
            "product_id": item.product_id,
            "quantity": item.quantity,
            "refund_amount": float(item.refund_amount),
            "reason": ret.reason,
            "status": ret.status,
            "created_at": ret.created_at,
        }
        for ret, item in returns
    ]


@router.post("/")
def create_return(
    data: ReturnCreate,
    db: Session = Depends(get_db),
):
    sale = db.get(Sale, data.sale_id)

    if not sale:
        raise HTTPException(
            status_code=404,
            detail="Sale not found",
        )

    sale_item = (
        db.query(SaleItem)
        .filter(
            SaleItem.sale_id == data.sale_id,
            SaleItem.product_id == data.product_id,
        )
        .first()
    )

    if not sale_item:
        raise HTTPException(
            status_code=400,
            detail="Product was not part of this sale",
        )

    if data.quantity > sale_item.quantity:
        raise HTTPException(
            status_code=400,
            detail="Return quantity exceeds sold quantity",
        )

    product = db.get(Product, data.product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    refund_amount = float(sale_item.unit_price) * data.quantity

    return_record = Return(
        sale_id=data.sale_id,
        staff_id=1,
        reason=data.reason,
        total_amount=refund_amount,
        status="COMPLETED",
    )

    db.add(return_record)
    db.flush()

    return_item = ReturnItem(
        return_id=return_record.id,
        product_id=data.product_id,
        quantity=data.quantity,
        refund_amount=refund_amount,
    )

    db.add(return_item)

    # Add returned quantity back to stock
    product.stock_quantity += data.quantity

    db.commit()

    return {
        "message": "Return processed successfully",
        "return_id": return_record.id,
        "refund_amount": refund_amount,
    }