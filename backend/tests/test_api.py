import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.database import get_session

# Setup an in-memory SQLite database isolated for each test run
sqlite_url = "sqlite://"
engine = create_engine(
    sqlite_url,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

@pytest.fixture(name="session")
def session_fixture():
    # Create schema in the test database
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    # Clean up schema after test completes
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session
    
    # Override get_session dependency in FastAPI to use the test database
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    # Restore standard dependencies after test
    app.dependency_overrides.clear()


# ==========================================
# API Integration Tests
# ==========================================

def test_create_cv(client: TestClient):
    """
    Verify creating a new CV works and matches the CV Schema format.
    """
    payload = {
        "slug": "test-slug",
        "passcode": "mysecret",
        "template": "modern",
        "cv_data": {
            "personalInfo": {
                "fullName": "Nguyen Van A",
                "email": "a@example.com",
                "phone": "0987654321"
            },
            "summary": "Full Stack Developer",
            "experience": [],
            "education": [],
            "projects": [],
            "skills": [],
            "certificates": [],
            "languages": []
        }
    }
    response = client.post("/api/cvs", json=payload)
    assert response.status_code == 201
    
    data = response.json()
    assert data["slug"] == "test-slug"
    assert data["template"] == "modern"
    assert data["cv_data"]["personalInfo"]["fullName"] == "Nguyen Van A"
    assert data["cv_data"]["personalInfo"]["phone"] == "0987654321"


def test_get_nonexistent_cv(client: TestClient):
    """
    Verify fetching a CV that does not exist returns 404 Not Found.
    """
    response = client.get("/api/cvs/nonexistent-slug")
    assert response.status_code == 404
    assert "Không tìm thấy CV" in response.json()["detail"]


def test_slug_collision(client: TestClient):
    """
    Verify creating a CV with a duplicate slug is blocked (strict collision handling).
    """
    payload_a = {
        "slug": "unique-slug",
        "passcode": "mysecret1",
        "cv_data": {
            "personalInfo": {
                "fullName": "User A",
                "email": "a@example.com"
            }
        }
    }
    # Create the first CV
    r1 = client.post("/api/cvs", json=payload_a)
    assert r1.status_code == 201

    payload_b = {
        "slug": "unique-slug",  # Duplicate Slug
        "passcode": "mysecret2",
        "cv_data": {
            "personalInfo": {
                "fullName": "User B",
                "email": "b@example.com"
            }
        }
    }
    # Try to create a second CV with the same slug
    r2 = client.post("/api/cvs", json=payload_b)
    assert r2.status_code == 400
    assert "Đường dẫn này đã được sử dụng" in r2.json()["detail"]


def test_update_cv_with_correct_passcode(client: TestClient):
    """
    Verify updating a CV works successfully when the correct passcode is provided.
    """
    # Create first
    payload_create = {
        "slug": "editable-slug",
        "passcode": "supersecret",
        "cv_data": {
            "personalInfo": {
                "fullName": "Original Name",
                "email": "original@example.com"
            }
        }
    }
    client.post("/api/cvs", json=payload_create)

    # Perform update with CORRECT passcode
    payload_update = {
        "passcode": "supersecret",
        "cv_data": {
            "personalInfo": {
                "fullName": "Updated Name",
                "email": "original@example.com"
            }
        }
    }
    r = client.put("/api/cvs/editable-slug", json=payload_update)
    assert r.status_code == 200
    assert r.json()["cv_data"]["personalInfo"]["fullName"] == "Updated Name"


def test_update_cv_with_incorrect_passcode(client: TestClient):
    """
    Verify updating a CV is unauthorized when an incorrect passcode is provided.
    """
    # Create first
    payload_create = {
        "slug": "secure-slug",
        "passcode": "supersecret",
        "cv_data": {
            "personalInfo": {
                "fullName": "Original Name",
                "email": "original@example.com"
            }
        }
    }
    client.post("/api/cvs", json=payload_create)

    # Perform update with INCORRECT passcode
    payload_update = {
        "passcode": "wrongpassword",
        "cv_data": {
            "personalInfo": {
                "fullName": "Hacked Name",
                "email": "original@example.com"
            }
        }
    }
    r = client.put("/api/cvs/secure-slug", json=payload_update)
    assert r.status_code == 401
    assert "Mật mã chỉnh sửa không chính xác" in r.json()["detail"]


def test_verify_passcode(client: TestClient):
    """
    Verify the passcode verification utility endpoint.
    """
    # Create first
    payload_create = {
        "slug": "verify-slug",
        "passcode": "securepass",
        "cv_data": {
            "personalInfo": {
                "fullName": "Nguyen Van A",
                "email": "a@example.com"
            }
        }
    }
    client.post("/api/cvs", json=payload_create)

    # Test with correct passcode
    r1 = client.post("/api/cvs/verify-slug/verify", json={"passcode": "securepass"})
    assert r1.status_code == 200
    assert r1.json()["status"] == "success"

    # Test with incorrect passcode
    r2 = client.post("/api/cvs/verify-slug/verify", json={"passcode": "wrongpass"})
    assert r2.status_code == 401
    assert "Mật mã chỉnh sửa không chính xác" in r2.json()["detail"]


def test_create_cv_with_custom_styles(client: TestClient):
    """
    Verify creating a new CV with specific themeColor and fontFamily stores and returns them correctly.
    """
    payload = {
        "slug": "styled-cv",
        "passcode": "pass123",
        "template": "executive",
        "cv_data": {
            "personalInfo": {
                "fullName": "Le Van B",
                "email": "b@example.com"
            },
            "themeColor": "rose",
            "fontFamily": "serif"
        }
    }
    response = client.post("/api/cvs", json=payload)
    assert response.status_code == 201
    
    data = response.json()
    assert data["slug"] == "styled-cv"
    assert data["template"] == "executive"
    assert data["cv_data"]["themeColor"] == "rose"
    assert data["cv_data"]["fontFamily"] == "serif"


def test_update_cv_styles(client: TestClient):
    """
    Verify updating custom styles (themeColor and fontFamily) persists them correctly.
    """
    # Create first with defaults
    payload_create = {
        "slug": "update-styled-cv",
        "passcode": "pass123",
        "cv_data": {
            "personalInfo": {
                "fullName": "Le Van B",
                "email": "b@example.com"
            }
        }
    }
    client.post("/api/cvs", json=payload_create)

    # Perform update with custom colors and fonts
    payload_update = {
        "passcode": "pass123",
        "cv_data": {
            "personalInfo": {
                "fullName": "Le Van B",
                "email": "b@example.com"
            },
            "themeColor": "emerald",
            "fontFamily": "mono"
        }
    }
    r = client.put("/api/cvs/update-styled-cv", json=payload_update)
    assert r.status_code == 200
    
    data = r.json()
    assert data["cv_data"]["themeColor"] == "emerald"
    assert data["cv_data"]["fontFamily"] == "mono"


def test_cv_default_styles_backward_compatibility(client: TestClient):
    """
    Verify that creating a CV without explicit themeColor and fontFamily assigns defaults ("indigo", "sans").
    """
    payload = {
        "slug": "legacy-cv",
        "passcode": "pass123",
        "cv_data": {
            "personalInfo": {
                "fullName": "Legacy User",
                "email": "legacy@example.com"
            }
        }
    }
    response = client.post("/api/cvs", json=payload)
    assert response.status_code == 201
    
    data = response.json()
    assert data["cv_data"]["themeColor"] == "indigo"
    assert data["cv_data"]["fontFamily"] == "sans"


def test_create_cv_with_avatar(client: TestClient):
    """
    Verify creating a CV with a Base64-encoded avatar works and persists correctly.
    """
    fake_avatar_base64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA="
    payload = {
        "slug": "avatar-cv",
        "passcode": "pass123",
        "cv_data": {
            "personalInfo": {
                "fullName": "Avatar Owner",
                "email": "avatar@example.com",
                "avatar": fake_avatar_base64
            }
        }
    }
    response = client.post("/api/cvs", json=payload)
    assert response.status_code == 201
    
    data = response.json()
    assert data["cv_data"]["personalInfo"]["avatar"] == fake_avatar_base64


