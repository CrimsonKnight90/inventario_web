from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime
from uuid import UUID

from src.db.session import get_session
from src.models.audit_log import AuditLog

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/")
async def list_audit_logs(
    session: AsyncSession = Depends(get_session),
    entity_type: str | None = Query(None, description="Filter by entity type (inventory, reservation, etc.)"),
    entity_id: UUID | None = Query(None, description="Filter by specific entity ID"),
    user_id: UUID | None = Query(None, description="Filter by user ID"),
    start_date: datetime | None = Query(None, description="Filter logs from this date (inclusive)"),
    end_date: datetime | None = Query(None, description="Filter logs until this date (inclusive)"),
    limit: int = Query(100, ge=1, le=1000),
):
    """List audit logs with optional filters."""
    stmt = select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit)

    if entity_type:
        stmt = stmt.where(AuditLog.entity_type == entity_type)
    if entity_id:
        stmt = stmt.where(AuditLog.entity_id == entity_id)
    if user_id:
        stmt = stmt.where(AuditLog.user_id == user_id)
    if start_date:
        stmt = stmt.where(AuditLog.timestamp >= start_date)
    if end_date:
        stmt = stmt.where(AuditLog.timestamp <= end_date)

    result = await session.execute(stmt)
    return result.scalars().all()
