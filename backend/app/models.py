from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from sqlmodel import SQLModel, Field, Column, JSON

# ==========================================
# 1. Pydantic Models for CV Schema (Data)
# ==========================================

class PersonalInfo(BaseModel):
    fullName: str
    title: Optional[str] = None
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    avatar: Optional[str] = None

class ExperienceItem(BaseModel):
    company: str
    position: str
    startDate: str
    endDate: Optional[str] = None
    description: str

class EducationItem(BaseModel):
    institution: str
    degree: str
    startDate: str
    endDate: Optional[str] = None
    description: Optional[str] = None

class ProjectItem(BaseModel):
    name: str
    role: str
    startDate: str
    endDate: Optional[str] = None
    description: str
    technologies: List[str] = []
    url: Optional[str] = None
    embedUrl: Optional[str] = None

class SkillGroup(BaseModel):
    category: str
    skills: List[str]

class CertificateItem(BaseModel):
    name: str
    issuer: str
    date: str
    url: Optional[str] = None

class LanguageItem(BaseModel):
    name: str
    level: str

class CVSchema(BaseModel):
    personalInfo: PersonalInfo
    summary: Optional[str] = None
    experience: List[ExperienceItem] = []
    education: List[EducationItem] = []
    projects: List[ProjectItem] = []
    skills: List[SkillGroup] = []
    certificates: List[CertificateItem] = []
    languages: List[LanguageItem] = []
    themeColor: Optional[str] = "indigo"
    fontFamily: Optional[str] = "sans"
    layoutDensity: Optional[str] = "normal"
    pageLayout: Optional[str] = "single"
    sectionOrder: Optional[List[str]] = None
    themeMode: Optional[str] = "light"
    sectionGap: Optional[int] = None
    pagePadding: Optional[int] = None
    translated_data: Optional[dict] = None


# ==========================================
# 2. Database Models (SQLModel Table)
# ==========================================

class CV(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(unique=True, index=True)
    passcode_hash: str
    template: str = Field(default="modern")
    # Store the complex CV schema data as a JSON object directly in SQLite
    cv_data: dict = Field(default_factory=dict, sa_column=Column(JSON))


# ==========================================
# 3. Request / Response Payload Schemas
# ==========================================

class CVCreate(BaseModel):
    slug: str
    passcode: str
    template: str = "modern"
    cv_data: CVSchema

class CVUpdate(BaseModel):
    passcode: str
    template: Optional[str] = None
    cv_data: Optional[CVSchema] = None

class CVResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    template: str
    cv_data: CVSchema


# ==========================================
# 4. Analytics Database & Ingestion Models
# ==========================================

class CVAnalytics(SQLModel, table=True):
    __tablename__ = "cv_analytics"
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True)
    timestamp: float = Field(index=True)
    event_type: str = Field(index=True)  # "view", "hover", "click", "export"
    section: Optional[str] = None        # "experience", "projects", etc.
    duration: Optional[float] = 0.0      # duration in seconds (for hover)
    device: Optional[str] = None          # "mobile", "desktop", "tablet"
    country: Optional[str] = None         # geo region
    city: Optional[str] = None

class AnalyticsEvent(BaseModel):
    event_type: str
    section: Optional[str] = None
    duration: Optional[float] = 0.0
    device: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None


