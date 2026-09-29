from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from app.core.database import get_db
from app.core.security import hash_password
from app.models.user import User, UserRole


router = APIRouter(
    prefix="/api/staff",
    tags=["Staff"],
)


class StaffCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class StaffResponse(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    is_active: bool

    class Config:
        from_attributes = True


@router.get("/", response_model=list[StaffResponse])
def get_staff(db: Session = Depends(get_db)):
    return db.scalars(
        select(User).where(User.role == UserRole.STAFF)
    ).all()


@router.post("/", response_model=StaffResponse)
def create_staff(
    data: StaffCreate,
    db: Session = Depends(get_db),
):
    existing = db.scalar(
        select(User).where(User.email == data.email)
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists",
        )

    staff = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=UserRole.STAFF,
        is_active=True,
    )

    db.add(staff)
    db.commit()
    db.refresh(staff)

    return staff


@router.delete("/{staff_id}")
def deactivate_staff(
    staff_id: int,
    db: Session = Depends(get_db),
):
    staff = db.scalar(
        select(User).where(
            User.id == staff_id,
            User.role == UserRole.STAFF,
        )
    )

    if not staff:
        raise HTTPException(
            status_code=404,
            detail="Staff member not found",
        )

    staff.is_active = False
    db.commit()

    return {"message": "Staff member deactivated"}