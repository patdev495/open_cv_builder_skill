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
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(engine)

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

def test_cv_analytics_e2e(client: TestClient):
    # 1. Create a mock CV first
    slug = "test-analytics-slug"
    passcode = "superpass"
    payload = {
        "slug": slug,
        "passcode": passcode,
        "template": "modern",
        "cv_data": {
            "personalInfo": {
                "fullName": "Nguyen Van Test",
                "email": "test@example.com"
            },
            "summary": "AI Tester",
            "experience": [],
            "education": [],
            "projects": [],
            "skills": [],
            "certificates": [],
            "languages": [],
            "themeMode": "dark"
        }
    }
    r_create = client.post("/api/cvs", json=payload)
    assert r_create.status_code == 201

    # 2. Log views, exports and hover events
    # Post view log 1
    r_view1 = client.post(
        f"/api/cvs/{slug}/analytics",
        json={"event_type": "view", "device": "desktop", "country": "Vietnam", "city": "Hanoi"}
    )
    assert r_view1.status_code == 200

    # Post view log 2 (mobile, USA)
    r_view2 = client.post(
        f"/api/cvs/{slug}/analytics",
        json={"event_type": "view", "device": "mobile", "country": "United States", "city": "San Francisco"}
    )
    assert r_view2.status_code == 200

    # Post hover event on experience section for 5.5 seconds
    r_hover1 = client.post(
        f"/api/cvs/{slug}/analytics",
        json={"event_type": "hover", "section": "experience", "duration": 5.5, "device": "desktop"}
    )
    assert r_hover1.status_code == 200

    # Post hover event on projects section for 12.0 seconds
    r_hover2 = client.post(
        f"/api/cvs/{slug}/analytics",
        json={"event_type": "hover", "section": "projects", "duration": 12.0, "device": "desktop"}
    )
    assert r_hover2.status_code == 200

    # Post PDF export log
    r_export = client.post(
        f"/api/cvs/{slug}/analytics",
        json={"event_type": "export", "device": "desktop"}
    )
    assert r_export.status_code == 200

    # 3. Retrieve stats with correct passcode
    r_dashboard_ok = client.get(
        f"/api/cvs/{slug}/analytics-dashboard",
        params={"passcode": passcode}
    )
    assert r_dashboard_ok.status_code == 200
    report = r_dashboard_ok.json()

    assert report["total_views"] == 2
    assert report["total_exports"] == 1
    assert report["total_focus_time"] == 17.5
    assert report["section_heatmap"]["experience"] == 5.5
    assert report["section_heatmap"]["projects"] == 12.0
    assert report["devices"]["desktop"] == 1
    assert report["devices"]["mobile"] == 1
    assert report["countries"]["Vietnam"] == 1
    assert report["countries"]["United States"] == 1

    # 4. Attempt retrieve stats with INCORRECT passcode
    r_dashboard_fail = client.get(
        f"/api/cvs/{slug}/analytics-dashboard",
        params={"passcode": "wrongpass"}
    )
    assert r_dashboard_fail.status_code == 401
    assert "Mật mã" in r_dashboard_fail.json()["detail"]

    # 5. Attempt retrieve stats for non-existent CV
    r_dashboard_missing = client.get(
        "/api/cvs/non-existent-slug/analytics-dashboard",
        params={"passcode": passcode}
    )
    assert r_dashboard_missing.status_code == 404

    # 6. Attempt reset stats with INCORRECT passcode
    r_reset_fail = client.post(
        f"/api/cvs/{slug}/analytics-reset",
        json={"passcode": "wrongpass"}
    )
    assert r_reset_fail.status_code == 401

    # 7. Attempt reset stats for non-existent CV
    r_reset_missing = client.post(
        "/api/cvs/non-existent-slug/analytics-reset",
        json={"passcode": passcode}
    )
    assert r_reset_missing.status_code == 404

    # 8. Reset stats with CORRECT passcode
    r_reset_ok = client.post(
        f"/api/cvs/{slug}/analytics-reset",
        json={"passcode": passcode}
    )
    assert r_reset_ok.status_code == 200
    assert r_reset_ok.json()["status"] == "success"

    # 9. Verify stats are all 0/empty
    r_dashboard_after = client.get(
        f"/api/cvs/{slug}/analytics-dashboard",
        params={"passcode": passcode}
    )
    assert r_dashboard_after.status_code == 200
    report_after = r_dashboard_after.json()
    assert report_after["total_views"] == 0
    assert report_after["total_exports"] == 0
    assert report_after["total_focus_time"] == 0.0
    assert len(report_after["section_heatmap"]) == 0
    assert len(report_after["devices"]) == 0
    assert len(report_after["countries"]) == 0
