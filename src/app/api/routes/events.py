from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from datetime import datetime, timezone

from src.app.db.session import get_session
from src.app.models.event import Event
from src.app.schemas.event import EventCreate, EventRead
from src.app.services.audit_logger import log_audit  # opcional

router = APIRouter(prefix="/events", tags=["events"])


@router.post("/", response_model=EventRead, status_code=status.HTTP_201_CREATED)
async def create_event(
    payload: EventCreate, session: AsyncSession = Depends(get_session)
) -> EventRead:
    # Verificar si ya existe un código igual
    result = await session.execute(select(Event).where(Event.code == payload.code))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Event code already exists")

    event = Event(**payload.dict())
    session.add(event)
    await session.commit()
    await session.refresh(event)
    return event


@router.get("/", response_model=list[EventRead])
async def list_events(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Event))
    return result.scalars().all()


@router.get("/{event_id}", response_model=EventRead)
async def get_event(event_id: UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.put("/{event_id}", response_model=EventRead)
async def update_event(
    event_id: UUID,
    payload: EventCreate,
    session: AsyncSession = Depends(get_session),
) -> EventRead:
    result = await session.execute(select(Event).where(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.code = payload.code
    event.name = payload.name
    event.updated_at = datetime.now(timezone.utc)

    await session.commit()
    await session.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: UUID, session: AsyncSession = Depends(get_session)):
    stmt = (
        update(Event)
        .where(Event.id == event_id, Event.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Event not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="event",
        entity_id=event_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return
