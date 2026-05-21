import os
import json
import httpx
from typing import Optional, Dict, Any

from app.utils.translation import extract_translatable_fields, merge_translated_fields

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

class GeminiClient:
    """
    Low-level adapter responsible for making requests to the Google Gemini API.
    """
    def __init__(self, api_key: str, client: Optional[httpx.AsyncClient] = None):
        self.api_key = api_key
        self.client = client or httpx.AsyncClient(timeout=30.0)

    async def generate_content(
        self,
        contents: list,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
        response_mime_type: Optional[str] = None,
        timeout: float = 30.0
    ) -> str:
        """
        Sends generation request to Gemini model API.
        """
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        data = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature
            }
        }
        if system_instruction:
            data["systemInstruction"] = {
                "parts": [
                    {
                        "text": system_instruction
                    }
                ]
            }
        if response_mime_type:
            data["generationConfig"]["responseMimeType"] = response_mime_type

        try:
            response = await self.client.post(url, json=data, headers=headers, timeout=timeout)
            
            if response.status_code != 200:
                err_body = response.json() if response.headers.get("content-type") == "application/json" else response.text
                raise httpx.HTTPStatusError(
                    f"Gemini API returned status code {response.status_code}: {err_body}",
                    request=response.request,
                    response=response
                )
            
            res_data = response.json()
            candidates = res_data.get("candidates", [])
            if not candidates:
                raise ValueError("No candidates found in Gemini response.")
            
            parts = candidates[0].get("content", {}).get("parts", [])
            if not parts:
                raise ValueError("Response parts from Gemini are empty.")
            
            return parts[0].get("text", "").strip()
        except (httpx.RequestError, httpx.HTTPStatusError) as exc:
            raise exc

class AICVModule:
    """
    High-level deep module executing CV-specific business logic using GeminiClient.
    """
    def __init__(self, gemini_client: GeminiClient):
        self.gemini_client = gemini_client

    async def optimize_section(self, text: str, section_type: str, language: str) -> str:
        """
        Optimize a specific CV section (summary or experience) using STAR methodology and language formatting.
        """
        req_type = section_type.lower()
        req_lang = language.lower()

        if req_type not in ["summary", "experience"]:
            raise ValueError("Loại nội dung không hợp lệ. Chỉ chấp nhận 'summary' hoặc 'experience'.")

        if req_lang not in ["vi", "en"]:
            raise ValueError("Ngôn ngữ không hợp lệ. Chỉ hỗ trợ 'vi' hoặc 'en'.")

        system_instruction = SYSTEM_INSTRUCTIONS[req_type][req_lang]
        contents = [
            {
                "parts": [
                    {
                        "text": text
                    }
                ]
            }
        ]
        
        return await self.gemini_client.generate_content(
            contents=contents,
            system_instruction=system_instruction,
            temperature=0.2,
            timeout=30.0
        )

    async def translate_cv_schema(self, cv_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Translate all human-written content in CV schema, handling field extraction and structural merging.
        """
        flat_fields = extract_translatable_fields(cv_data)
        if not flat_fields:
            return cv_data

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

        contents = [
            {
                "parts": [
                    {
                        "text": json.dumps(flat_fields, ensure_ascii=False)
                    }
                ]
            }
        ]

        translated_text = await self.gemini_client.generate_content(
            contents=contents,
            system_instruction=system_instruction,
            temperature=0.1,
            response_mime_type="application/json",
            timeout=45.0
        )

        response_json = json.loads(translated_text)
        target_lang = response_json.get("target_lang")
        translated_fields = response_json.get("translated_fields")

        if not target_lang or not translated_fields:
            raise ValueError("Missing required keys in AI response")

        translated_cv_subset = merge_translated_fields(cv_data, translated_fields)
        
        final_cv = cv_data.copy()
        if "translated_data" not in final_cv or final_cv["translated_data"] is None:
            final_cv["translated_data"] = {}
            
        final_cv["translated_data"][target_lang] = translated_cv_subset
        return final_cv
