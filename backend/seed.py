from sqlalchemy import select

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.supplier import Supplier
from app.models.product import Product


def seed_database():
    db = SessionLocal()

    try:
        # -------------------------
        # USERS
        # -------------------------

        admin = db.scalar(
            select(User).where(
                User.email == "admin@retailpos.com"
            )
        )

        if not admin:
            admin = User(
                name="Admin User",
                email="admin@retailpos.com",
                password_hash=hash_password("Admin@123"),
                role=UserRole.ADMIN,
            )
            db.add(admin)

        staff = db.scalar(
            select(User).where(
                User.email == "staff@retailpos.com"
            )
        )

        if not staff:
            staff = User(
                name="Staff User",
                email="staff@retailpos.com",
                password_hash=hash_password("Staff@123"),
                role=UserRole.STAFF,
            )
            db.add(staff)

        # -------------------------
        # SUPPLIERS
        # -------------------------

        supplier = db.scalar(
            select(Supplier).where(
                Supplier.name == "Kerala Textile Suppliers"
            )
        )

        if not supplier:
            supplier = Supplier(
                name="Kerala Textile Suppliers",
                contact_person="Arun Kumar",
                phone="9876543210",
                email="supplier@example.com",
                address="Kochi, Kerala",
            )
            db.add(supplier)
            db.flush()

        # -------------------------
        # PRODUCTS
        # -------------------------

        products = [
            {
                "sku": "TSHIRT-001",
                "name": "Cotton T-Shirt",
                "category": "T-Shirts",
                "price": 599,
                "cost_price": 350,
                "stock_quantity": 25,
                "reorder_level": 5,
            },
            {
                "sku": "JEANS-001",
                "name": "Classic Denim Jeans",
                "category": "Jeans",
                "price": 1499,
                "cost_price": 900,
                "stock_quantity": 15,
                "reorder_level": 5,
            },
            {
                "sku": "SHIRT-001",
                "name": "Formal Cotton Shirt",
                "category": "Shirts",
                "price": 899,
                "cost_price": 500,
                "stock_quantity": 20,
                "reorder_level": 5,
            },
            {
                "sku": "KURTA-001",
                "name": "Cotton Kurta",
                "category": "Ethnic Wear",
                "price": 799,
                "cost_price": 450,
                "stock_quantity": 12,
                "reorder_level": 5,
            },
            {
                "sku": "LINEN-001",
                "name": "Linen Casual Shirt",
                "category": "Shirts",
                "price": 1199,
                "cost_price": 700,
                "stock_quantity": 8,
                "reorder_level": 5,
            },
        ]

        for product_data in products:
            existing = db.scalar(
                select(Product).where(
                    Product.sku == product_data["sku"]
                )
            )

            if not existing:
                db.add(
                    Product(
                        **product_data,
                        supplier_id=supplier.id,
                    )
                )

        db.commit()

        print("Database seeded successfully.")
        print()
        print("Admin:")
        print("  Email: admin@retailpos.com")
        print("  Password: Admin@123")
        print()
        print("Staff:")
        print("  Email: staff@retailpos.com")
        print("  Password: Staff@123")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()