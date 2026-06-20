from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.customer import Customer
from app.models.order import Order
from app.schemas.customer import CustomerCreate
from app.exceptions import NotFoundException, ValidationException, ConflictException


def get_customers(
    db: Session,
    search: str | None = None,
    page: int = 1,
    size: int = 20,
):
    query = db.query(Customer)

    if search:
        query = query.filter(
            or_(
                Customer.full_name.ilike(f"%{search}%"),
                Customer.email.ilike(f"%{search}%"),
            )
        )

    total = query.count()
    items = query.offset((page - 1) * size).limit(size).all()
    pages = (total + size - 1) // size

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages,
    }


def get_customer(db: Session, customer_id: int):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise NotFoundException("Customer not found")
    return customer


def get_customer_with_order_count(db: Session, customer_id: int):
    customer = get_customer(db, customer_id)
    order_count = db.query(Order).filter(Order.customer_id == customer_id).count()
    return {
        "id": customer.id,
        "full_name": customer.full_name,
        "email": customer.email,
        "phone": customer.phone,
        "created_at": customer.created_at,
        "order_count": order_count,
    }


def create_customer(db: Session, data: CustomerCreate):
    existing = db.query(Customer).filter(Customer.email == data.email).first()
    if existing:
        raise ValidationException("Email already registered")

    customer = Customer(**data.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer_id: int):
    customer = get_customer(db, customer_id)

    existing_orders = db.query(Order).filter(Order.customer_id == customer_id).first()
    if existing_orders:
        raise ConflictException("Customer has existing orders. Delete orders first.")

    db.delete(customer)
    db.commit()
    return customer
