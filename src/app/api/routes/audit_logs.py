from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from src.app.db.session import get_session
from src.app.models.audit_log import AuditLog
from src.app.schemas.audit_log import AuditLogRead

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("/", response_model=list[AuditLogRead])
async def list_audit_logs(
    session: AsyncSession = Depends(get_session),
    entity_name: str | None = Query(None),
    entity_id: UUID | None = Query(None),
    limit: int = Query(50, ge=1, le=500),
) -> list[AuditLogRead]:
    """List audit logs with optional filters."""
    stmt = select(AuditLog).order_by(AuditLog.occurred_at.desc()).limit(limit)
    if entity_name:
        stmt = stmt.where(AuditLog.entity_name == entity_name)
    if entity_id:
        stmt = stmt.where(AuditLog.entity_id == entity_id)

    result = await session.execute(stmt)
    return result.scalars().all()


@router.get("/{log_id}", response_model=AuditLogRead)
async def get_audit_log(log_id: UUID, session: AsyncSession = Depends(get_session)) -> AuditLogRead:
    """Get a single audit log entry by ID."""
    result = await session.execute(select(AuditLog).where(AuditLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit log not found")
    return log
