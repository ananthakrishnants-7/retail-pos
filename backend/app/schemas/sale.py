from datetime import datetime

from pydantic import BaseModel, Field


class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class SaleCreate(BaseModel):
    items: list[SaleItemCreate] = Field(min_length=1)
    discount: float = Field(default=0, ge=0)
    tax: float = Field(default=0, ge=0)
    payment_method: str = Field(default="CASH", min_length=2)


class SaleItemResponse(BaseModel):
    product_id: int
    quantity: int
    unit_price: float
    subtotal: float


class SaleResponse(BaseModel):
    id: int
    invoice_number: str
    subtotal: float
    discount: float
    tax: float
    total: float
    payment_method: str
    status: str
    created_at: datetime
    items: list[SaleItemResponse]