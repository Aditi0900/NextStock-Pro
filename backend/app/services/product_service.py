from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.product import Product
from app.models.order_item import OrderItem
from app.schemas.product import ProductCreate, ProductUpdate
from app.exceptions import NotFoundException, ValidationException, ConflictException


def get_products(
    db: Session,
    search: str | None = None,
    category: str | None = None,
    low_stock: bool | None = None,
    sort_by: str | None = None,
    sort_order: str = "asc",
    page: int = 1,
    size: int = 20,
):
    query = db.query(Product)

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.sku.ilike(f"%{search}%"),
            )
        )

    if category:
        query = query.filter(Product.category == category)

    if low_stock:
        query = query.filter(Product.quantity <= 10)

    if sort_by and hasattr(Product, sort_by):
        sort_column = getattr(Product, sort_by)
        if sort_order == "desc":
            sort_column = sort_column.desc()
        query = query.order_by(sort_column)
    else:
        query = query.order_by(Product.created_at.desc())

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


def get_product(db: Session, product_id: int):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise NotFoundException("Product not found")
    return product


def create_product(db: Session, data: ProductCreate):
    existing = db.query(Product).filter(Product.sku == data.sku).first()
    if existing:
        raise ValidationException("SKU already exists")

    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product_id: int, data: ProductUpdate):
    product = get_product(db, product_id)

    if data.sku is not None and data.sku != product.sku:
        existing = db.query(Product).filter(Product.sku == data.sku).first()
        if existing:
            raise ValidationException("SKU already exists")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int):
    product = get_product(db, product_id)

    order_ref = db.query(OrderItem).filter(OrderItem.product_id == product_id).first()
    if order_ref:
        raise ConflictException("Cannot delete product that is referenced by order items")

    db.delete(product)
    db.commit()
    return product
