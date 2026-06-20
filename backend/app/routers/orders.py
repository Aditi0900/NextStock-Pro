from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.order import OrderCreate, OrderResponse, OrderListItem, OrderListResponse, StatusUpdate
from app.services import order_service

router = APIRouter()


@router.post("", response_model=OrderResponse, status_code=201)
def create_order(data: OrderCreate, db: Session = Depends(get_db)):
    return order_service.create_order(db, data)


@router.get("", response_model=OrderListResponse)
def list_orders(
    status: str | None = Query(None),
    customer_id: int | None = Query(None),
    sort_by: str | None = Query(None),
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    date_from: str | None = Query(None),
    date_to: str | None = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return order_service.get_orders(db, status, customer_id, sort_by, sort_order, date_from, date_to, page, size)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    return order_service.get_order(db, order_id)


@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: int, data: StatusUpdate, db: Session = Depends(get_db)):
    return order_service.update_order_status(db, order_id, data.status)


@router.put("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(order_id: int, db: Session = Depends(get_db)):
    return order_service.cancel_order(db, order_id)


@router.delete("/{order_id}", response_model=OrderResponse)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    return order_service.delete_order(db, order_id)
