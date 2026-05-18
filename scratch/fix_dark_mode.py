import os
import re
import glob

templates_dir = "frontend/src/templates"
files = glob.glob(f"{templates_dir}/*Template.tsx")

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix invalid custom tailwind values
    content = content.replace("slate-855", "slate-800")
    content = content.replace("slate-655", "slate-600")
    content = content.replace("slate-550", "slate-500")
    content = content.replace("slate-150", "slate-200")
    content = content.replace("slate-850", "slate-800")
    content = content.replace("slate-750", "slate-700")
    content = content.replace("slate-650", "slate-600")

    # 2. Inject dark mode classes intelligently
    # Only replace if the dark mode variant doesn't already exist
    replacements = [
        ("bg-white", "bg-white dark:bg-slate-900/50"),
        ("bg-slate-50", "bg-slate-50 dark:bg-slate-800/50"),
        ("bg-slate-100", "bg-slate-100 dark:bg-slate-800/80"),
        ("text-slate-900", "text-slate-900 dark:text-slate-100"),
        ("text-slate-800", "text-slate-800 dark:text-slate-200"),
        ("text-slate-700", "text-slate-700 dark:text-slate-300"),
        ("text-slate-600", "text-slate-600 dark:text-slate-400"),
        ("text-slate-500", "text-slate-500 dark:text-slate-400"),
        ("border-slate-100", "border-slate-100 dark:border-slate-800"),
        ("border-slate-200", "border-slate-200 dark:border-slate-700"),
        ("border-slate-300", "border-slate-300 dark:border-slate-600"),
        ("border-slate-800", "border-slate-800 dark:border-slate-400"),
    ]

    for light, dark_pair in replacements:
        # Regex to match the light class but ONLY if it doesn't already have the dark pair right after it,
        # or it's not part of another word (like text-slate-800-some-thing, though tailwind doesn't do that much)
        # Using a simple replacement is usually fine if we haven't done it before.
        # We can first do a pass to ensure we don't duplicate.
        content = content.replace(dark_pair, light) # remove if already there
        content = re.sub(rf'\b{light}\b', dark_pair, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Processed {len(files)} template files.")
