from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional


class CustomerCreate(BaseModel):
    full_name: str = Field(..., max_length=200)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class CustomerDetailResponse(CustomerResponse):
    order_count: int = 0


class CustomerListResponse(BaseModel):
    items: list[CustomerResponse]
    total: int
    page: int
    size: int
    pages: int
