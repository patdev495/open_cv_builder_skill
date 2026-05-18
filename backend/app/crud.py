from typing import Optional
from sqlmodel import Session, select
from app.models import CV, CVCreate, CVUpdate
from app.auth import get_passcode_hash

def get_cv_by_slug(db: Session, slug: str) -> Optional[CV]:
    """
    Retrieve a CV by its unique Slug from SQLite.
    Slugs are case-insensitive and whitespace trimmed.
    """
    normalized_slug = slug.strip().lower()
    statement = select(CV).where(CV.slug == normalized_slug)
    return db.exec(statement).first()

def create_cv(db: Session, cv_in: CVCreate) -> CV:
    """
    Create a new CV in SQLite. 
    Hashes the passcode and serializes the Pydantic CV Schema data.
    """
    db_cv = CV(
        slug=cv_in.slug.strip().lower(),
        passcode_hash=get_passcode_hash(cv_in.passcode),
        template=cv_in.template,
        cv_data=cv_in.cv_data.model_dump()
    )
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    return db_cv

def update_cv(db: Session, db_cv: CV, cv_in: CVUpdate) -> CV:
    """
    Update an existing CV in SQLite.
    """
    if cv_in.template is not None:
        db_cv.template = cv_in.template
    if cv_in.cv_data is not None:
        db_cv.cv_data = cv_in.cv_data.model_dump()
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    return db_cv
