from pydantic import BaseModel, EmailStr, constr
from uuid import UUID
from datetime import datetime

class UserBase(BaseModel):
    username: constr(min_length=3, max_length=50)
    email: EmailStr
    active: bool = True

class UserCreate(UserBase):
    password: constr(min_length=6)

class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    active: bool | None = None

class UserRead(UserBase):
    id: UUID
    created_at: datetime
    updated_at: datetime | None
    deleted_at: datetime | None

    class Config:
        from_attributes = True
