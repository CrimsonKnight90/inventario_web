from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from uuid import UUID
from datetime import datetime, timezone

from src.app.db.session import get_session
from src.app.models.party import Party
from src.app.schemas.party import PartyCreate, PartyRead
from src.app.services.audit_logger import log_audit  # opcional

router = APIRouter(prefix="/parties", tags=["parties"])


@router.post("/", response_model=PartyRead, status_code=status.HTTP_201_CREATED)
async def create_party(
    payload: PartyCreate, session: AsyncSession = Depends(get_session)
) -> PartyRead:
    # Verificar si ya existe un nombre igual (opcional, depende de negocio)
    result = await session.execute(select(Party).where(Party.name == payload.name))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Party already exists")

    party = Party(**payload.dict())
    session.add(party)
    await session.commit()
    await session.refresh(party)
    return party


@router.get("/", response_model=list[PartyRead])
async def list_parties(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Party))
    return result.scalars().all()


@router.get("/{party_id}", response_model=PartyRead)
async def get_party(party_id: UUID, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Party).where(Party.id == party_id))
    party = result.scalar_one_or_none()
    if not party:
        raise HTTPException(status_code=404, detail="Party not found")
    return party


@router.put("/{party_id}", response_model=PartyRead)
async def update_party(
    party_id: UUID,
    payload: PartyCreate,
    session: AsyncSession = Depends(get_session),
) -> PartyRead:
    result = await session.execute(select(Party).where(Party.id == party_id))
    party = result.scalar_one_or_none()
    if not party:
        raise HTTPException(status_code=404, detail="Party not found")

    for field, value in payload.dict().items():
        setattr(party, field, value)

    party.updated_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(party)
    return party


@router.delete("/{party_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_party(party_id: UUID, session: AsyncSession = Depends(get_session)):
    stmt = (
        update(Party)
        .where(Party.id == party_id, Party.deleted_at.is_(None))
        .values(deleted_at=datetime.now(timezone.utc), updated_at=datetime.now(timezone.utc))
    )
    result = await session.execute(stmt)
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Party not found or already deleted")

    # Opcional: registrar en AuditLog
    await log_audit(
        session=session,
        entity_type="party",
        entity_id=party_id,
        action="soft_delete",
        changes={"deleted_at": "now()"},
        user_id=None,
    )

    await session.commit()
    return
