import pytest
from app.utils.translation import extract_translatable_fields, merge_translated_fields
from app.models import CVSchema

def test_extract_and_merge_translation():
    mock_cv = {
        "personalInfo": {
            "fullName": "Nguyen Van A",
            "title": "Kỹ sư phần mềm",
            "email": "a@example.com"
        },
        "summary": "Tôi là kỹ sư giỏi.",
        "experience": [
            {
                "id": "exp-1",
                "company": "Tech Corp",
                "position": "Nhà phát triển",
                "startDate": "2020-01-01",
                "description": "Làm web"
            }
        ],
        "education": [],
        "projects": [],
        "skills": [],
        "certificates": [],
        "languages": [],
        "themeColor": "indigo"
    }

    # Extract
    extracted = extract_translatable_fields(mock_cv)
    assert extracted == {
        "personalInfo.title": "Kỹ sư phần mềm",
        "summary": "Tôi là kỹ sư giỏi.",
        "experience.0.position": "Nhà phát triển",
        "experience.0.description": "Làm web"
    }

    # Simulate AI translating
    translated_fields = {
        "personalInfo.title": "Software Engineer",
        "summary": "I am a good engineer.",
        "experience.0.position": "Developer",
        "experience.0.description": "Web development"
    }

    # Merge
    merged = merge_translated_fields(mock_cv, translated_fields)
    
    # Check if untranslated structural data is kept intact
    assert merged["personalInfo"]["fullName"] == "Nguyen Van A"
    assert merged["personalInfo"]["email"] == "a@example.com"
    assert merged["experience"][0]["company"] == "Tech Corp"
    assert merged["experience"][0]["startDate"] == "2020-01-01"
    
    # Check if translated data is applied correctly
    assert merged["personalInfo"]["title"] == "Software Engineer"
    assert merged["summary"] == "I am a good engineer."
    assert merged["experience"][0]["position"] == "Developer"
    assert merged["experience"][0]["description"] == "Web development"

    # Ensure it's a deep copy, not mutating original
    assert mock_cv["summary"] == "Tôi là kỹ sư giỏi."
