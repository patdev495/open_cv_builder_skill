import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, MagicMock
import httpx

from app.main import app
from app.services.ai import GeminiClient, AICVModule
from app.routers.ai import get_ai_cv_module

client = TestClient(app)

# ---------------------------------------------------------
# 1. Unit Tests for GeminiClient (Low-level network client)
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_gemini_client_generate_content_success():
    """
    Test that GeminiClient successfully builds requests and parses normal responses.
    """
    mock_http_client = AsyncMock()
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.headers = {"content-type": "application/json"}
    mock_response.json.return_value = {
        "candidates": [
            {
                "content": {
                    "parts": [
                        {"text": "  Optimized text response  "}
                    ]
                }
            }
        ]
    }
    mock_http_client.post.return_value = mock_response

    gemini_client = GeminiClient(api_key="test-key", client=mock_http_client)
    
    contents = [{"parts": [{"text": "input text"}]}]
    result = await gemini_client.generate_content(
        contents=contents,
        system_instruction="Do it",
        temperature=0.5,
        response_mime_type="application/json"
    )
    
    assert result == "Optimized text response"
    mock_http_client.post.assert_called_once()
    
    called_args, called_kwargs = mock_http_client.post.call_args
    assert "key=test-key" in called_args[0]
    payload = called_kwargs["json"]
    assert payload["contents"] == contents
    assert payload["systemInstruction"]["parts"][0]["text"] == "Do it"
    assert payload["generationConfig"]["temperature"] == 0.5
    assert payload["generationConfig"]["responseMimeType"] == "application/json"

@pytest.mark.anyio
async def test_gemini_client_generate_content_http_error():
    """
    Test that GeminiClient raises HTTPStatusError when the API returns an error status code.
    """
    mock_http_client = AsyncMock()
    mock_response = MagicMock()
    mock_response.status_code = 403
    mock_response.headers = {"content-type": "application/json"}
    mock_response.json.return_value = {"error": "Invalid API Key"}
    mock_response.request = httpx.Request("POST", "http://test")
    mock_http_client.post.return_value = mock_response

    gemini_client = GeminiClient(api_key="test-key", client=mock_http_client)
    
    with pytest.raises(httpx.HTTPStatusError):
        await gemini_client.generate_content(contents=[])

# ---------------------------------------------------------
# 2. Unit Tests for AICVModule (High-level CV logic)
# ---------------------------------------------------------

@pytest.mark.anyio
async def test_ai_cv_module_optimize_section():
    """
    Test that AICVModule formats input arguments and delegates to GeminiClient.
    """
    mock_gemini = AsyncMock()
    mock_gemini.generate_content.return_value = "STAR Optimized Summary"
    
    ai_module = AICVModule(gemini_client=mock_gemini)
    result = await ai_module.optimize_section(
        text="Draft content",
        section_type="summary",
        language="vi"
    )
    
    assert result == "STAR Optimized Summary"
    mock_gemini.generate_content.assert_called_once()
    called_kwargs = mock_gemini.generate_content.call_args[1]
    assert called_kwargs["contents"] == [{"parts": [{"text": "Draft content"}]}]
    assert "chuyên gia viết CV" in called_kwargs["system_instruction"]
    assert called_kwargs["temperature"] == 0.2

@pytest.mark.anyio
async def test_ai_cv_module_optimize_invalid_inputs():
    """
    Test that AICVModule raises ValueError on invalid types or languages.
    """
    ai_module = AICVModule(gemini_client=AsyncMock())
    
    with pytest.raises(ValueError, match="Loại nội dung không hợp lệ"):
        await ai_module.optimize_section("text", "skills", "vi")
        
    with pytest.raises(ValueError, match="Ngôn ngữ không hợp lệ"):
        await ai_module.optimize_section("text", "summary", "fr")

@pytest.mark.anyio
async def test_ai_cv_module_translate_cv_schema():
    """
    Test that AICVModule orchestrates translation via extract/generate/merge steps.
    """
    mock_gemini = AsyncMock()
    mock_gemini.generate_content.return_value = (
        '{"target_lang": "en", "translated_fields": {"summary": "I am a dev"}}'
    )
    
    ai_module = AICVModule(gemini_client=mock_gemini)
    
    cv_data = {
        "personalInfo": {"fullName": "Nguyen A"},
        "summary": "Tôi là dev",
        "experience": []
    }
    
    translated_cv = await ai_module.translate_cv_schema(cv_data)
    
    assert translated_cv["summary"] == "Tôi là dev"
    assert translated_cv["translated_data"]["en"]["summary"] == "I am a dev"
    assert translated_cv["personalInfo"]["fullName"] == "Nguyen A"

# ---------------------------------------------------------
# 3. Router Tests using FastAPI Dependency Injection Seams
# ---------------------------------------------------------

def test_router_optimize_missing_api_key():
    """
    Verify endpoint returns 503 when GEMINI_API_KEY is not defined.
    """
    with patch.dict("os.environ", {}, clear=True):
        payload = {
            "text": "tôi là dev",
            "type": "summary",
            "language": "vi"
        }
        response = client.post("/api/ai/optimize", json=payload)
        assert response.status_code == 503
        assert "Tính năng AI hiện chưa được cấu hình" in response.json()["detail"]

def test_router_optimize_invalid_params():
    """
    Verify endpoint returns 400 when invalid type or language parameters are provided.
    """
    with patch.dict("os.environ", {"GEMINI_API_KEY": "fake-key"}):
        response = client.post(
            "/api/ai/optimize",
            json={"text": "text", "type": "invalid", "language": "vi"}
        )
        assert response.status_code == 400
        
        response = client.post(
            "/api/ai/optimize",
            json={"text": "text", "type": "summary", "language": "ja"}
        )
        assert response.status_code == 400

def test_router_optimize_success():
    """
    Verify endpoint returns 200 and optimized content on successful module execution.
    """
    mock_module = AsyncMock()
    mock_module.optimize_section.return_value = "Optimized via service dependency injection override"
    
    app.dependency_overrides[get_ai_cv_module] = lambda: mock_module
    
    try:
        payload = {
            "text": "tôi là dev",
            "type": "summary",
            "language": "vi"
        }
        response = client.post("/api/ai/optimize", json=payload)
        
        assert response.status_code == 200
        assert response.json()["optimized_text"] == "Optimized via service dependency injection override"
        mock_module.optimize_section.assert_called_once_with(
            text="tôi là dev",
            section_type="summary",
            language="vi"
        )
    finally:
        app.dependency_overrides.clear()

def test_router_optimize_api_error():
    """
    Verify endpoint returns 502 when service dependency encounters HTTP status error.
    """
    mock_module = AsyncMock()
    request = httpx.Request("POST", "http://test")
    response = httpx.Response(400, content=b"Bad Request Error from Google API", request=request)
    mock_module.optimize_section.side_effect = httpx.HTTPStatusError(
        message="API error",
        request=request,
        response=response
    )
    
    app.dependency_overrides[get_ai_cv_module] = lambda: mock_module
    
    try:
        payload = {
            "text": "tôi là dev",
            "type": "summary",
            "language": "vi"
        }
        response = client.post("/api/ai/optimize", json=payload)
        
        assert response.status_code == 502
        assert "Lỗi khi kết nối với Gemini API" in response.json()["detail"]
    finally:
        app.dependency_overrides.clear()
