from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem

router = APIRouter()


@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_products = db.query(func.count(Product.id)).scalar() or 0
    total_customers = db.query(func.count(Customer.id)).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar() or 0

    revenue_result = db.query(func.sum(Order.total_amount)).scalar()
    total_revenue = float(revenue_result) if revenue_result else 0.0

    low_stock_products = (
        db.query(Product)
        .filter(Product.quantity <= 10)
        .order_by(Product.quantity.asc())
        .all()
    )
    low_stock_count = len(low_stock_products)

    recent_orders = (
        db.query(Order, Customer.full_name)
        .join(Customer, Order.customer_id == Customer.id)
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )

    orders_by_status = (
        db.query(Order.status, func.count(Order.id))
        .group_by(Order.status)
        .all()
    )
    orders_by_status_dict = {status: count for status, count in orders_by_status}

    return {
        "total_products": total_products,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "low_stock_count": low_stock_count,
        "low_stock_products": [
            {
                "id": p.id,
                "name": p.name,
                "sku": p.sku,
                "quantity": p.quantity,
            }
            for p in low_stock_products
        ],
        "recent_orders": [
            {
                "id": order.id,
                "customer_name": full_name,
                "status": order.status,
                "total_amount": float(order.total_amount),
                "item_count": (
                    db.query(func.count(OrderItem.id))
                    .filter(OrderItem.order_id == order.id)
                    .scalar()
                    or 0
                ),
                "created_at": order.created_at.isoformat(),
            }
            for order, full_name in recent_orders
        ],
        "orders_by_status": {
            "pending": orders_by_status_dict.get("pending", 0),
            "confirmed": orders_by_status_dict.get("confirmed", 0),
            "shipped": orders_by_status_dict.get("shipped", 0),
            "delivered": orders_by_status_dict.get("delivered", 0),
            "cancelled": orders_by_status_dict.get("cancelled", 0),
        },
    }
