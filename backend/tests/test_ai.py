import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import httpx

from app.main import app

client = TestClient(app)

def test_ai_optimize_missing_api_key():
    """
    Verify endpoint returns 503 Service Unavailable when GEMINI_API_KEY is not defined.
    """
    with patch.dict("os.environ", {}, clear=True):
        payload = {
            "text": "tôi là dev react",
            "type": "summary",
            "language": "vi"
        }
        response = client.post("/api/ai/optimize", json=payload)
        assert response.status_code == 503
        assert "Tính năng AI hiện chưa được cấu hình" in response.json()["detail"]


def test_ai_optimize_invalid_params():
    """
    Verify endpoint returns 400 Bad Request when invalid type or language is provided.
    """
    with patch.dict("os.environ", {"GEMINI_API_KEY": "fake-key"}):
        # Invalid type
        payload = {
            "text": "tôi là dev react",
            "type": "invalid_type",
            "language": "vi"
        }
        response = client.post("/api/ai/optimize", json=payload)
        assert response.status_code == 400
        assert "Loại nội dung không hợp lệ" in response.json()["detail"]

        # Invalid language
        payload = {
            "text": "tôi là dev react",
            "type": "summary",
            "language": "ja"
        }
        response = client.post("/api/ai/optimize", json=payload)
        assert response.status_code == 400
        assert "Ngôn ngữ không hợp lệ" in response.json()["detail"]


@pytest.mark.anyio
@patch("httpx.AsyncClient.post")
async def test_ai_optimize_success(mock_post):
    """
    Verify successful AI CV optimization call using mocked Gemini response.
    """
    from unittest.mock import MagicMock
    
    # Configure mock response for successful Gemini API call
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.headers = {"content-type": "application/json"}
    mock_response.json = MagicMock(return_value={
        "candidates": [
            {
                "content": {
                    "parts": [
                        {
                            "text": "Tôi là kỹ sư lập trình React có 2 năm kinh nghiệm thực tế."
                        }
                    ]
                }
            }
        ]
    })
    mock_post.return_value = mock_response

    with patch.dict("os.environ", {"GEMINI_API_KEY": "fake-key"}):
        payload = {
            "text": "tôi là dev react 2 nam",
            "type": "summary",
            "language": "vi"
        }
        # Run using TestClient sync calling async endpoint
        response = client.post("/api/ai/optimize", json=payload)
        
        assert response.status_code == 200
        assert response.json()["optimized_text"] == "Tôi là kỹ sư lập trình React có 2 năm kinh nghiệm thực tế."
        
        # Verify the target Gemini URL and headers were called
        called_args, called_kwargs = mock_post.call_args
        assert "generativelanguage.googleapis.com" in called_args[0]
        assert "fake-key" in called_args[0]
        assert called_kwargs["json"]["generationConfig"]["temperature"] == 0.2


@pytest.mark.anyio
@patch("httpx.AsyncClient.post")
async def test_ai_optimize_api_error(mock_post):
    """
    Verify 502 Bad Gateway is returned when Gemini API responds with non-200 error.
    """
    from unittest.mock import MagicMock

    # Configure mock response for failed Gemini API call
    mock_response = AsyncMock()
    mock_response.status_code = 400
    mock_response.headers = {"content-type": "application/json"}
    mock_response.json = MagicMock(return_value={
        "error": {
            "message": "API key not valid"
        }
    })
    mock_post.return_value = mock_response

    with patch.dict("os.environ", {"GEMINI_API_KEY": "fake-key"}):
        payload = {
            "text": "tôi là dev react",
            "type": "summary",
            "language": "vi"
        }
        response = client.post("/api/ai/optimize", json=payload)
        
        assert response.status_code == 502
        assert "Lỗi khi kết nối với Gemini API" in response.json()["detail"]
