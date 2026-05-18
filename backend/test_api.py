import urllib.request
import json

data = {
    "cv_data": {
        "personalInfo": {
            "title": "Kỹ sư phần mềm"
        },
        "summary": "Tôi thích lập trình.",
        "experience": [],
        "education": [],
        "projects": [],
        "skills": [],
        "certificates": [],
        "languages": []
    }
}

req = urllib.request.Request(
    'http://localhost:8000/api/ai/translate-cv', 
    data=json.dumps(data).encode('utf-8'),
    headers={'Content-Type': 'application/json'},
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print("STATUS:", response.status)
        print("RESPONSE:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP ERROR:", e.code)
    print("REASON:", e.read().decode('utf-8'))
except Exception as e:
    print("ERROR:", str(e))
