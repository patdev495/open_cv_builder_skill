from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from contextlib import asynccontextmanager

from app.database import create_db_and_tables, get_session
from app.models import CVCreate, CVUpdate, CVResponse
from app.auth import verify_passcode
import app.crud as crud

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Automatically initialize SQLite database and create tables on startup
    create_db_and_tables()
    yield

app = FastAPI(
    title="CV Builder API",
    description="Backend API service for CV Builder application",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for React Frontend (runs on different ports e.g. 5173/5174)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/cvs", response_model=CVResponse, status_code=status.HTTP_201_CREATED)
def create_new_cv(cv_in: CVCreate, db: Session = Depends(get_session)):
    """
    Endpoint to create a new CV.
    Validates Slug uniqueness to prevent collision.
    """
    existing_cv = crud.get_cv_by_slug(db, cv_in.slug)
    if existing_cv:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Đường dẫn này đã được sử dụng. Vui lòng chọn một đường dẫn khác."
        )
    return crud.create_cv(db, cv_in)

@app.get("/api/cvs/{slug}", response_model=CVResponse)
def read_cv(slug: str, db: Session = Depends(get_session)):
    """
    Endpoint to fetch a CV. 
    Publicly accessible (anyone with the URL can view it).
    """
    db_cv = crud.get_cv_by_slug(db, slug)
    if not db_cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy CV với đường dẫn này."
        )
    return db_cv

@app.put("/api/cvs/{slug}", response_model=CVResponse)
def update_existing_cv(slug: str, cv_in: CVUpdate, db: Session = Depends(get_session)):
    """
    Endpoint to update an existing CV.
    Requires validating the correct passcode.
    """
    db_cv = crud.get_cv_by_slug(db, slug)
    if not db_cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy CV với đường dẫn này."
        )
    
    # Authenticate via Passcode
    if not verify_passcode(cv_in.passcode, db_cv.passcode_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Mật mã chỉnh sửa không chính xác."
        )
    
    return crud.update_cv(db, db_cv, cv_in)

@app.post("/api/cvs/{slug}/verify")
def verify_cv_passcode(slug: str, payload: dict, db: Session = Depends(get_session)):
    """
    Endpoint to verify if a passcode is correct before entering edit mode.
    """
    db_cv = crud.get_cv_by_slug(db, slug)
    if not db_cv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy CV với đường dẫn này."
        )
    
    passcode = payload.get("passcode")
    if not passcode:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vui lòng cung cấp mật mã xác thực."
        )
    
    is_valid = verify_passcode(passcode, db_cv.passcode_hash)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Mật mã chỉnh sửa không chính xác."
        )
    
    return {"status": "success", "message": "Mật mã chính xác."}
