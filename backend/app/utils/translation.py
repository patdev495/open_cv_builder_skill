import copy
from typing import Dict, Any

def extract_translatable_fields(cv_data: Dict[str, Any]) -> Dict[str, str]:
    """
    Extracts only human-written, localized content text fields from CVSchema
    into a flat key-value dictionary to minimize translation API token usage and prevent key mapping shifts.
    """
    flat_fields = {}

    # 1. Personal Info
    personal_info = cv_data.get("personalInfo", {})
    if personal_info.get("title"):
        flat_fields["personalInfo.title"] = personal_info["title"]

    # 2. Summary
    if cv_data.get("summary"):
        flat_fields["summary"] = cv_data["summary"]

    # 3. Experience
    experience = cv_data.get("experience", [])
    for idx, item in enumerate(experience):
        if item.get("position"):
            flat_fields[f"experience.{idx}.position"] = item["position"]
        if item.get("description"):
            flat_fields[f"experience.{idx}.description"] = item["description"]

    # 4. Education
    education = cv_data.get("education", [])
    for idx, item in enumerate(education):
        if item.get("degree"):
            flat_fields[f"education.{idx}.degree"] = item["degree"]
        if item.get("description"):
            flat_fields[f"education.{idx}.description"] = item["description"]

    # 5. Projects
    projects = cv_data.get("projects", [])
    for idx, item in enumerate(projects):
        if item.get("role"):
            flat_fields[f"projects.{idx}.role"] = item["role"]
        if item.get("description"):
            flat_fields[f"projects.{idx}.description"] = item["description"]

    # 6. Skill Groups (Categories only)
    skills = cv_data.get("skills", [])
    for idx, item in enumerate(skills):
        if item.get("category"):
            flat_fields[f"skills.{idx}.category"] = item["category"]

    # 7. Certificates (Issuer & Name)
    certificates = cv_data.get("certificates", [])
    for idx, item in enumerate(certificates):
        if item.get("name"):
            flat_fields[f"certificates.{idx}.name"] = item["name"]
        if item.get("issuer"):
            flat_fields[f"certificates.{idx}.issuer"] = item["issuer"]

    return flat_fields

def merge_translated_fields(original_cv_data: Dict[str, Any], translated_fields: Dict[str, str]) -> Dict[str, Any]:
    """
    Deep-clones the original structural CV data and replaces only translatable path keys with 
    their translated values.
    """
    translated_cv = copy.deepcopy(original_cv_data)

    # Helper function to set value in deep dict using dot-separated path keys
    def set_by_path(d: Any, path: str, val: str) -> None:
        parts = path.split(".")
        current = d
        for i, part in enumerate(parts[:-1]):
            # If next part is index, convert to int
            if part.isdigit():
                idx = int(part)
                # Expand array if out of bounds (should not happen, but safe fallback)
                while len(current) <= idx:
                    current.append({})
                current = current[idx]
            else:
                if part not in current or current[part] is None:
                    current[part] = {} if parts[i+1].isdigit() else {}
                current = current[part]

        last_part = parts[-1]
        if last_part.isdigit():
            idx = int(last_part)
            while len(current) <= idx:
                current.append("")
            current[idx] = val
        else:
            current[last_part] = val

    for path, value in translated_fields.items():
        if value:
            try:
                set_by_path(translated_cv, path, value)
            except Exception as e:
                # Log error and continue to make it highly robust
                print(f"Failed to merge path {path} with value {value}: {e}")

    # Remove nested translated_data from target translated schema to prevent circular nesting
    if "translated_data" in translated_cv:
        translated_cv["translated_data"] = None

    return translated_cv
