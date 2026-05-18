from typing import Optional
import time
from sqlmodel import Session, select, func
from app.models import CV, CVCreate, CVUpdate, CVAnalytics, AnalyticsEvent
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

def create_analytics_log(db: Session, slug: str, event: AnalyticsEvent) -> CVAnalytics:
    """
    Create an anonymous analytics interaction log for a CV slug.
    """
    db_log = CVAnalytics(
        slug=slug.strip().lower(),
        timestamp=time.time(),
        event_type=event.event_type,
        section=event.section,
        duration=event.duration or 0.0,
        device=event.device,
        country=event.country or "Local",
        city=event.city or "Local"
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_cv_analytics_summary(db: Session, slug: str) -> dict:
    """
    Query and return aggregated analytics for a specific CV slug.
    """
    normalized_slug = slug.strip().lower()
    
    # 1. Total Views
    views_stmt = select(func.count()).select_from(CVAnalytics).where(
        CVAnalytics.slug == normalized_slug,
        CVAnalytics.event_type == "view"
    )
    total_views = db.exec(views_stmt).first() or 0
    
    # 2. Total PDF Exports
    exports_stmt = select(func.count()).select_from(CVAnalytics).where(
        CVAnalytics.slug == normalized_slug,
        CVAnalytics.event_type == "export"
    )
    total_exports = db.exec(exports_stmt).first() or 0
    
    # 3. Total Focus Duration (Hover)
    focus_stmt = select(func.sum(CVAnalytics.duration)).select_from(CVAnalytics).where(
        CVAnalytics.slug == normalized_slug,
        CVAnalytics.event_type == "hover"
    )
    total_focus_time = db.exec(focus_stmt).first() or 0.0
    
    # 4. Heat-map by Section (hover sum duration)
    sections_stmt = select(CVAnalytics.section, func.sum(CVAnalytics.duration)).select_from(CVAnalytics).where(
        CVAnalytics.slug == normalized_slug,
        CVAnalytics.event_type == "hover"
    ).group_by(CVAnalytics.section)
    sections_res = db.exec(sections_stmt).all()
    section_heatmap = {sec: float(dur or 0) for sec, dur in sections_res if sec}
    
    # 5. Device distribution
    device_stmt = select(CVAnalytics.device, func.count()).select_from(CVAnalytics).where(
        CVAnalytics.slug == normalized_slug,
        CVAnalytics.event_type == "view"
    ).group_by(CVAnalytics.device)
    device_res = db.exec(device_stmt).all()
    devices = {dev or "Unknown": count for dev, count in device_res}
    
    # 6. Geo distribution
    geo_stmt = select(CVAnalytics.country, func.count()).select_from(CVAnalytics).where(
        CVAnalytics.slug == normalized_slug,
        CVAnalytics.event_type == "view"
    ).group_by(CVAnalytics.country).order_by(func.count().desc()).limit(5)
    geo_res = db.exec(geo_stmt).all()
    countries = {c or "Unknown": count for c, count in geo_res}

    return {
        "total_views": total_views,
        "total_exports": total_exports,
        "total_focus_time": round(total_focus_time, 1),
        "section_heatmap": section_heatmap,
        "devices": devices,
        "countries": countries
    }
