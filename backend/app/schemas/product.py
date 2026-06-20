from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional


class ProductCreate(BaseModel):
    name: str = Field(..., max_length=200)
    sku: str = Field(..., max_length=100)
    description: Optional[str] = None
    price: Decimal = Field(..., ge=0, max_digits=12, decimal_places=2)
    quantity: int = Field(..., ge=0)
    category: Optional[str] = Field(None, max_length=100)


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    sku: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0, max_digits=12, decimal_places=2)
    quantity: Optional[int] = Field(None, ge=0)
    category: Optional[str] = Field(None, max_length=100)


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    description: Optional[str] = None
    price: Decimal
    quantity: int
    category: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    size: int
    pages: int
