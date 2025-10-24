from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from datetime import datetime, timezone

from src.app.db.session import get_session
from src.app.models.product import Product
from src.app.schemas.product import ProductCreate, ProductRead
from src.app.services.audit_logger import log_audit  # opcional, si quieres auditar

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
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


@router.get("/{product_id}", response_model=ProductRead)
async def get_product(product_id: UUID, session: AsyncSession = Depends(get_session)) -> ProductRead:
    """Get a single product by ID."""
    result = await session.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=ProductRead)
async def update_product(
    product_id: UUID, payload: ProductCreate, session: AsyncSession = Depends(get_session)
) -> ProductRead:
    """Update an existing product."""
    result = await session.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in payload.dict().items():
        setattr(product, field, value)

    product.updated_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: UUID, session: AsyncSession = Depends(get_session)):
    """Soft delete a product by setting deleted_at."""
    stmt = (
        update(Product)
        .where(Product.id == product_id, Product.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Product not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="product",
        entity_id=product_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return
