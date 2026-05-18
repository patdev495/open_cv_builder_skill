from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
import os
import httpx
from typing import Optional

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
