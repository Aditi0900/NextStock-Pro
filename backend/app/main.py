from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import products, customers, orders, dashboard
from app.database import engine, Base
from app.config import settings
from app.exceptions import register_exception_handlers

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NexStock Pro API",
    description="Production-Ready Inventory & Order Management System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(customers.router, prefix="/customers", tags=["Customers"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "service": "NexStock Pro API"}
