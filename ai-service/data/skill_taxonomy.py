# A starter skill taxonomy for the demo.
# In production this would come from ESCO / O*NET / a curated industry list.
# Keep it flat for MVP - category is just metadata for display.

SKILL_TAXONOMY = {
    # Programming languages
    "python": "Programming Language",
    "java": "Programming Language",
    "c": "Programming Language",
    "c++": "Programming Language",
    "embedded c": "Programming Language",
    "javascript": "Programming Language",
    "typescript": "Programming Language",

    # Web dev
    "react": "Frontend",
    "react.js": "Frontend",
    "reactjs": "Frontend",
    "node.js": "Backend",
    "nodejs": "Backend",
    "fastapi": "Backend",
    "express.js": "Backend",
    "html": "Frontend",
    "css": "Frontend",

    # Data / AI
    "machine learning": "AI/ML",
    "deep learning": "AI/ML",
    "nlp": "AI/ML",
    "natural language processing": "AI/ML",
    "computer vision": "AI/ML",
    "scikit-learn": "AI/ML",
    "tensorflow": "AI/ML",
    "pytorch": "AI/ML",

    # Databases
    "sql": "Database",
    "postgresql": "Database",
    "mongodb": "Database",
    "mysql": "Database",

    # Embedded / hardware
    "esp32": "Embedded Systems",
    "arduino": "Embedded Systems",
    "raspberry pi": "Embedded Systems",
    "iot": "Embedded Systems",

    # Soft skills
    "communication": "Soft Skill",
    "teamwork": "Soft Skill",
    "leadership": "Soft Skill",
    "problem solving": "Soft Skill",
    "time management": "Soft Skill",
}

# Common abbreviations/aliases that fuzzy string matching gets wrong
# (too short / too different in spelling to score well against the
# canonical form). Checked with an exact lookup BEFORE fuzzy matching.
SKILL_ALIASES = {
    "ml": "machine learning",
    "dl": "deep learning",
    "cv": "computer vision",
    "nlp": "natural language processing",
    "js": "javascript",
    "ts": "typescript",
    "css3": "css",
    "html5": "html",
    "postgres": "postgresql",
    "py": "python",
    "iot": "iot",
    "sklearn": "scikit-learn",
}

def get_all_skills():
    return list(SKILL_TAXONOMY.keys())

def get_category(skill: str):
    return SKILL_TAXONOMY.get(skill.lower(), "Other")
