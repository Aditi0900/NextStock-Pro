from pydantic import BaseModel
from typing import Generic, TypeVar, List

T = TypeVar("T")


class MessageResponse(BaseModel):
    detail: str
    error_code: str | None = None


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    pages: int
