from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    customer_id: int
    notes: Optional[str] = None
    items: list[OrderItemCreate]


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    sku: str
    quantity: int
    unit_price: Decimal
    subtotal: Decimal

    class Config:
        from_attributes = True


class OrderCustomerInfo(BaseModel):
    id: int
    full_name: str
    email: str

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    status: str
    total_amount: Decimal
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    customer: OrderCustomerInfo
    items: list[OrderItemResponse]

    class Config:
        from_attributes = True


class OrderListItem(BaseModel):
    id: int
    customer_id: int
    customer_name: str
    status: str
    total_amount: Decimal
    item_count: int
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    items: list[OrderListItem]
    total: int
    page: int
    size: int
    pages: int


class StatusUpdate(BaseModel):
    status: str = Field(..., pattern=r"^(pending|confirmed|shipped|delivered|cancelled)$")
