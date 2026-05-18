from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
import os
import httpx
import json
from typing import Optional, Dict, Any

from app.models import CVSchema
from app.utils.translation import extract_translatable_fields, merge_translated_fields

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

# System instructions mapped by type and language
SYSTEM_INSTRUCTIONS = {
    "summary": {
        "vi": (
            "Bạn là một chuyên gia viết CV và cố vấn tuyển dụng chuyên nghiệp. Nhiệm vụ của bạn là tối ưu hóa đoạn giới thiệu bản thân (Professional Summary) của ứng viên. "
            "Hãy viết lại hoặc dịch đoạn giới thiệu này sang Tiếng Việt sao cho thật súc tích, chuyên nghiệp, làm nổi bật định hướng nghề nghiệp và giá trị cốt lõi của ứng viên. "
            "Đảm bảo ngôn ngữ viết mượt mà, thu hút nhà tuyển dụng. Chỉ trả về kết quả đã tối ưu hóa, KHÔNG chào hỏi, giải thích hay thêm bất kỳ ký tự thừa nào."
        ),
        "en": (
            "You are a professional resume writer and career coach. Your task is to optimize the candidate's Professional Summary and translate it to English if it is in another language. "
            "Rewrite it to be concise, compelling, and highlighting their career direction and key value proposition. Use strong professional keywords and polished English vocabulary. "
            "Output ONLY the optimized summary. Do NOT include any introductory or concluding text, explanations, or extra symbols."
        )
    },
    "experience": {
        "vi": (
            "Bạn là một chuyên gia viết CV chuyên nghiệp. Nhiệm vụ của bạn là tối ưu hóa phần mô tả kinh nghiệm làm việc hoặc mô tả dự án của ứng viên. "
            "Hãy viết lại hoặc dịch đoạn mô tả này sang Tiếng Việt theo công thức STAR (Situation, Task, Action, Result) chuẩn quốc tế. "
            "Sử dụng các động từ hành động mạnh mẽ (ví dụ: 'Chủ trì', 'Phát triển', 'Tối ưu', 'Xây dựng') ở đầu dòng. "
            "Giữ nguyên định dạng gạch đầu dòng (bullet points) hoặc đoạn văn tùy theo định dạng đầu vào. "
            "Chỉ trả về kết quả đã tối ưu hóa, KHÔNG chào hỏi, giải thích hay thêm bất kỳ ký tự thừa nào."
        ),
        "en": (
            "You are an expert resume writer. Your task is to optimize the candidate's work experience or project description and translate it to English if it is in another language. "
            "Rewrite the bullet points or text using the professional STAR method (Situation, Task, Action, Result). "
            "Start each bullet point with a strong, impact-driven action verb (e.g., 'Spearheaded', 'Architected', 'Optimized', 'Designed', 'Engineered'). "
            "Ensure the vocabulary sounds polished and targets recruiters in the technology or professional fields. "
            "Output ONLY the polished experience. Do NOT include any greetings, explanations, or extra symbols."
        )
    }
}

@router.post("/optimize", response_model=AIOptimizeResponse)
async def optimize_cv_section(payload: AIOptimizeRequest):
    """
    Endpoint to optimize or translate a CV section (summary or experience) using Google Gemini 1.5 Flash.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Tính năng AI hiện chưa được cấu hình (Thiếu GEMINI_API_KEY ở máy chủ)."
        )

    # Validate requested type and language
    req_type = payload.type.lower()
    req_lang = payload.language.lower()

    if req_type not in ["summary", "experience"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Loại nội dung không hợp lệ. Chỉ chấp nhận 'summary' hoặc 'experience'."
        )

    if req_lang not in ["vi", "en"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ngôn ngữ không hợp lệ. Chỉ hỗ trợ 'vi' hoặc 'en'."
        )

    # Get the system instruction
    system_instruction = SYSTEM_INSTRUCTIONS[req_type][req_lang]

    # Prepare Gemini API request url and payload
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": payload.text
                    }
                ]
            }
        ],
        "systemInstruction": {
            "parts": [
                {
                    "text": system_instruction
                }
            ]
        },
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 1000
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=data, headers=headers)
            
            if response.status_code != 200:
                # Log or handle error response from Google
                err_body = response.json() if response.headers.get("content-type") == "application/json" else response.text
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Lỗi khi kết nối với Gemini API: {err_body}"
                )
            
            res_data = response.json()
            candidates = res_data.get("candidates", [])
            if not candidates:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Không nhận được kết quả tối ưu từ AI."
                )
            
            # Extract generated text safely
            parts = candidates[0].get("content", {}).get("parts", [])
            if not parts:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Nội dung trả về từ AI bị trống."
                )
            
            optimized_text = parts[0].get("text", "").strip()
            return AIOptimizeResponse(optimized_text=optimized_text)

    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"Máy chủ AI không phản hồi kịp thời: {exc}"
        )


class AITranslateCVRequest(BaseModel):
    cv_data: Dict[str, Any]

@router.post("/translate-cv")
async def translate_full_cv(payload: AITranslateCVRequest) -> Dict[str, Any]:
    """
    Endpoint to translate a full CV in 1 click.
    Extracts translatable fields, sends to Gemini 2.5 Flash, and merges the response.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Tính năng AI hiện chưa được cấu hình (Thiếu GEMINI_API_KEY ở máy chủ)."
        )

    # 1. Extract translatable fields
    flat_fields = extract_translatable_fields(payload.cv_data)
    if not flat_fields:
        return payload.cv_data  # Nothing to translate

    # 2. Prepare Gemini Prompt
    system_instruction = (
        "You are a highly skilled professional resume translator and linguistic detector. "
        "You will receive a JSON object containing text fields extracted from a candidate's CV. "
        "First, DETECT the language of the provided text values. "
        "If the original text is predominantly Vietnamese, translate all string values to English. "
        "If the original text is predominantly English, translate all string values to Vietnamese. "
        "If it is another language, translate it to English. "
        "Maintain professional tech terminology (e.g., do not translate 'React', 'Frontend', etc. if they are industry standards). "
        "You MUST return ONLY a valid JSON object with EXACTLY this structure:\n"
        "{\n"
        "  \"target_lang\": \"en\" (if translated to English) or \"vi\" (if translated to Vietnamese),\n"
        "  \"translated_fields\": { <the flat key-value pairs matching exactly the input keys but with translated values> }\n"
        "}"
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": json.dumps(flat_fields, ensure_ascii=False)
                    }
                ]
            }
        ],
        "systemInstruction": {
            "parts": [
                {
                    "text": system_instruction
                }
            ]
        },
        "generationConfig": {
            "temperature": 0.1,
            "responseMimeType": "application/json"
        }
    }

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(url, json=data, headers=headers)
            
            if response.status_code != 200:
                err_body = response.json() if response.headers.get("content-type") == "application/json" else response.text
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Lỗi khi kết nối với Gemini API: {err_body}"
                )
            
            res_data = response.json()
            candidates = res_data.get("candidates", [])
            if not candidates:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Không nhận được kết quả dịch từ AI."
                )
            
            parts = candidates[0].get("content", {}).get("parts", [])
            if not parts:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Nội dung trả về từ AI bị trống."
                )
            
            translated_text = parts[0].get("text", "").strip()
            
            try:
                response_json = json.loads(translated_text)
                target_lang = response_json.get("target_lang")
                translated_fields = response_json.get("translated_fields")
                
                if not target_lang or not translated_fields:
                    raise ValueError("Missing required keys in AI response")
            except Exception:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="AI trả về dữ liệu không đúng cấu trúc yêu cầu."
                )

            # 3. Merge translated fields back into a clone of original schema
            translated_cv_subset = merge_translated_fields(payload.cv_data, translated_fields)
            
            # 4. Construct the final full CV with translated_data populated
            final_cv = payload.cv_data.copy()
            if "translated_data" not in final_cv or final_cv["translated_data"] is None:
                final_cv["translated_data"] = {}
                
            final_cv["translated_data"][target_lang] = translated_cv_subset
            return final_cv

    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"Máy chủ AI không phản hồi kịp thời: {exc}"
        )
