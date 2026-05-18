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

