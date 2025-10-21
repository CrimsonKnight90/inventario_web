from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from src.db.session import get_session
from src.models.product import Product
from src.schemas.product import ProductCreate, ProductRead

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/", response_model=ProductRead, status_code=201)
async def create_product(
    payload: ProductCreate, session: AsyncSession = Depends(get_session)
) -> ProductRead:
    """Create a new product."""
    stmt = select(Product).where(Product.sku == payload.sku)
    result = await session.execute(stmt)
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="SKU already exists")

    product = Product(**payload.dict())
    session.add(product)
    await session.commit()
    await session.refresh(product)
    return product


@router.get("/", response_model=list[ProductRead])
async def list_products(
    session: AsyncSession = Depends(get_session),
    limit: int = Query(10, ge=1, le=100),
    cursor: UUID | None = Query(None),
) -> list[ProductRead]:
    """List products with cursor-based pagination."""
    stmt = select(Product).order_by(Product.id).limit(limit)
    if cursor:
        stmt = stmt.where(Product.id > cursor)
    result = await session.execute(stmt)
    return result.scalars().all()
