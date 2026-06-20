from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from decimal import Decimal

from app.database import Base


def _replace_decimal(obj):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, Decimal):
                obj[k] = str(v)
            else:
                _replace_decimal(v)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            if isinstance(v, Decimal):
                obj[i] = str(v)
            else:
                _replace_decimal(v)


class NotFoundException(Exception):
    def __init__(self, detail: str = "Resource not found"):
        self.detail = detail


class ValidationException(Exception):
    def __init__(self, detail: str):
        self.detail = detail


class ConflictException(Exception):
    def __init__(self, detail: str):
        self.detail = detail


def register_exception_handlers(app):
    @app.exception_handler(NotFoundException)
    async def not_found_handler(request: Request, exc: NotFoundException):
        return JSONResponse(
            status_code=404,
            content={"detail": exc.detail, "error_code": "NOT_FOUND"},
        )

    @app.exception_handler(ValidationException)
    async def validation_error_handler(request: Request, exc: ValidationException):
        return JSONResponse(
            status_code=400,
            content={"detail": exc.detail, "error_code": "VALIDATION_ERROR"},
        )

    @app.exception_handler(ConflictException)
    async def conflict_handler(request: Request, exc: ConflictException):
        return JSONResponse(
            status_code=409,
            content={"detail": exc.detail, "error_code": "CONFLICT"},
        )

    @app.exception_handler(RequestValidationError)
    async def pydantic_validation_handler(request: Request, exc: RequestValidationError):
        errors = exc.errors()
        _replace_decimal(errors)
        return JSONResponse(
            status_code=422,
            content={"detail": errors, "error_code": "INVALID_INPUT"},
        )

    @app.exception_handler(Exception)
    async def generic_error_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )
