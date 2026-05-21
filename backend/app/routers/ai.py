from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
import os
import httpx
from typing import Optional, Dict, Any

from app.services.ai import GeminiClient, AICVModule

router = APIRouter(
    prefix="/api/ai",
    tags=["ai"]
)

class AIOptimizeRequest(BaseModel):
    text: str = Field(..., description="Đoạn văn bản thô cần tối ưu hóa hoặc dịch thuật")
    type: str = Field(..., description="Loại trường nội dung: 'summary' hoặc 'experience'")
    language: str = Field("vi", description="Ngôn ngữ đầu ra: 'vi' (Tiếng Việt) hoặc 'en' (Tiếng Anh)")

class AIOptimizeResponse(BaseModel):
    optimized_text: str

class AITranslateCVRequest(BaseModel):
    cv_data: Dict[str, Any]

# Dependency providers
def get_gemini_client() -> GeminiClient:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Tính năng AI hiện chưa được cấu hình (Thiếu GEMINI_API_KEY ở máy chủ)."
        )
    return GeminiClient(api_key=api_key)

def get_ai_cv_module(gemini_client: GeminiClient = Depends(get_gemini_client)) -> AICVModule:
    return AICVModule(gemini_client)

@router.post("/optimize", response_model=AIOptimizeResponse)
async def optimize_cv_section(
    payload: AIOptimizeRequest,
    ai_module: AICVModule = Depends(get_ai_cv_module)
):
    """
    Endpoint to optimize or translate a CV section (summary or experience) using Google Gemini 2.5 Flash.
    """
    try:
        optimized_text = await ai_module.optimize_section(
            text=payload.text,
            section_type=payload.type,
            language=payload.language
        )
        return AIOptimizeResponse(optimized_text=optimized_text)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc)
        )
    except httpx.HTTPStatusError as exc:
        err_text = exc.response.text if (exc.response and hasattr(exc.response, 'text')) else str(exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Lỗi khi kết nối với Gemini API: {err_text}"
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"Máy chủ AI không phản hồi kịp thời: {exc}"
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Lỗi không xác định khi kết nối với AI: {exc}"
        )

@router.post("/translate-cv")
async def translate_full_cv(
    payload: AITranslateCVRequest,
    ai_module: AICVModule = Depends(get_ai_cv_module)
) -> Dict[str, Any]:
    """
    Endpoint to translate a full CV in 1 click.
    Extracts translatable fields, sends to Gemini 2.5 Flash, and merges the response.
    """
    try:
        return await ai_module.translate_cv_schema(payload.cv_data)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc)
        )
    except httpx.HTTPStatusError as exc:
        err_text = exc.response.text if (exc.response and hasattr(exc.response, 'text')) else str(exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Lỗi khi kết nối với Gemini API: {err_text}"
        )
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"Máy chủ AI không phản hồi kịp thời: {exc}"
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Lỗi không xác định khi kết nối với AI: {exc}"
        )
