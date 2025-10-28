# src/app/schemas/user_role.py

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class UserRoleBase(BaseModel):
    user_id: UUID
    role_id: UUID

class UserRoleCreate(UserRoleBase):
    pass

class UserRoleRead(UserRoleBase):
    assigned_at: datetime

    class Config:
        orm_mode = True
