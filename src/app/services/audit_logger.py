from sqlalchemy.ext.asyncio import AsyncSession
from src.app.models.audit_log import AuditLog
from uuid import UUID
from datetime import datetime, timezone
from typing import Optional, Dict, Any


async def log_audit(
    session: AsyncSession,
    entity_type: str,
    entity_id: UUID,
    action: str,
    changes: Optional[Dict[str, Any]] = None,
    user_id: Optional[UUID] = None,
) -> None:
    """
    Insert an audit log entry into audit_log table.
    The AuditLog ORM/model should align with DB columns (performed_by_user_id / occurred_at).
    """
    # Use explicit field names matching model
    entry = AuditLog(
        entity_type=entity_type,
        entity_id=entity_id,
        action=action,
        changes=changes,
        user_id=user_id,
        timestamp=datetime.now(timezone.utc),
    )
    session.add(entry)
    # Do not commit here; caller controls transaction lifecycle.
