from decimal import Decimal
from sqlalchemy.orm import Session, joinedload

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.customer import Customer
from app.schemas.order import OrderCreate
from app.exceptions import NotFoundException, ValidationException, ConflictException

VALID_TRANSITIONS = {
    "pending": {"confirmed", "cancelled"},
    "confirmed": {"shipped", "cancelled"},
    "shipped": {"delivered", "cancelled"},
    "delivered": set(),
    "cancelled": set(),
}


def get_orders(
    db: Session,
    status: str | None = None,
    customer_id: int | None = None,
    sort_by: str | None = None,
    sort_order: str = "asc",
    date_from: str | None = None,
    date_to: str | None = None,
    page: int = 1,
    size: int = 20,
):
    query = db.query(Order).options(
        joinedload(Order.customer),
        joinedload(Order.items).joinedload(OrderItem.product),
    )

    if status:
        query = query.filter(Order.status == status)

    if customer_id:
        query = query.filter(Order.customer_id == customer_id)

    if date_from:
        query = query.filter(Order.created_at >= date_from)
    if date_to:
        query = query.filter(Order.created_at <= date_to)

    if sort_by and hasattr(Order, sort_by):
        sort_column = getattr(Order, sort_by)
        if sort_order == "desc":
            sort_column = sort_column.desc()
        query = query.order_by(sort_column)
    else:
        query = query.order_by(Order.created_at.desc())

    total = query.count()
    orders = query.offset((page - 1) * size).limit(size).all()
    pages = (total + size - 1) // size

    items = []
    for order in orders:
        items.append({
            "id": order.id,
            "customer_id": order.customer_id,
            "customer_name": order.customer.full_name,
            "status": order.status,
            "total_amount": order.total_amount,
            "item_count": len(order.items),
            "notes": order.notes,
            "created_at": order.created_at,
        })

    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size,
        "pages": pages,
    }


def get_order(db: Session, order_id: int):
    order = (
        db.query(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.items).joinedload(OrderItem.product),
        )
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise NotFoundException("Order not found")

    item_responses = []
    for item in order.items:
        item_responses.append({
            "id": item.id,
            "product_id": item.product_id,
            "product_name": item.product.name,
            "sku": item.product.sku,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "subtotal": item.unit_price * item.quantity,
        })

    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "status": order.status,
        "total_amount": order.total_amount,
        "notes": order.notes,
        "created_at": order.created_at,
        "updated_at": order.updated_at,
        "customer": {
            "id": order.customer.id,
            "full_name": order.customer.full_name,
            "email": order.customer.email,
        },
        "items": item_responses,
    }


def create_order(db: Session, data: OrderCreate):
    if not data.items:
        raise ValidationException("Order must have at least one item")

    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        raise NotFoundException(f"Customer with id {data.customer_id} not found")

    product_ids = [item.product_id for item in data.items]
    products = db.query(Product).filter(Product.id.in_(product_ids)).all()
    product_map = {p.id: p for p in products}

    for item in data.items:
        product = product_map.get(item.product_id)
        if not product:
            raise NotFoundException(f"Product with id {item.product_id} not found")
        if product.quantity < item.quantity:
            raise ValidationException(
                f"Insufficient stock for product '{product.name}'. "
                f"Available: {product.quantity}, Requested: {item.quantity}"
            )

    total_amount = Decimal("0.00")
    order = Order(
        customer_id=data.customer_id,
        notes=data.notes,
        status="pending",
        total_amount=Decimal("0.00"),
    )
    db.add(order)
    db.flush()

    for item in data.items:
        product = product_map[item.product_id]
        unit_price = product.price
        subtotal = unit_price * item.quantity
        total_amount += subtotal

        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=unit_price,
        )
        db.add(order_item)

        product.quantity -= item.quantity

    order.total_amount = total_amount
    db.commit()
    db.refresh(order)

    return get_order(db, order.id)


def cancel_order(db: Session, order_id: int):
    order = (
        db.query(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.items).joinedload(OrderItem.product),
        )
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise NotFoundException("Order not found")

    cancellable = {"pending", "confirmed"}
    if order.status not in cancellable:
        raise ValidationException(
            f"Cannot cancel order in '{order.status}' status. "
            "Only pending or confirmed orders can be cancelled."
        )

    for item in order.items:
        product = item.product
        if product:
            product.quantity += item.quantity

    order.status = "cancelled"
    db.commit()
    db.refresh(order)

    return get_order(db, order.id)


def update_order_status(db: Session, order_id: int, new_status: str):
    order = (
        db.query(Order)
        .options(
            joinedload(Order.customer),
            joinedload(Order.items).joinedload(OrderItem.product),
        )
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise NotFoundException("Order not found")

    if new_status not in VALID_TRANSITIONS.get(order.status, set()):
        raise ValidationException(
            f"Cannot transition order from '{order.status}' to '{new_status}'. "
            f"Valid transitions: {', '.join(sorted(VALID_TRANSITIONS.get(order.status, set())))}"
        )

    order.status = new_status
    db.commit()
    db.refresh(order)

    return get_order(db, order.id)


def delete_order(db: Session, order_id: int):
    result = get_order(db, order_id)

    order = db.query(Order).filter(Order.id == order_id).first()
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.quantity += item.quantity

    db.delete(order)
    db.commit()
    return result
