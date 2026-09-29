from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Return(Base):
    __tablename__ = "returns"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    sale_id: Mapped[int] = mapped_column(
        ForeignKey("sales.id"),
        nullable=False,
    )

    staff_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    reason: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    total_amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="COMPLETED",
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    items = relationship(
        "ReturnItem",
        back_populates="return_record",
        cascade="all, delete-orphan",
    )


class ReturnItem(Base):
    __tablename__ = "return_items"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    return_id: Mapped[int] = mapped_column(
        ForeignKey("returns.id"),
        nullable=False,
    )

    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id"),
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        nullable=False,
    )

    refund_amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    return_record = relationship(
        "Return",
        back_populates="items",
    )

    product = relationship("Product")
    