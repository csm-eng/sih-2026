"""
Matching Engine
----------------
One reusable engine, three uses in the pitch:
  1. Skill Gap Analysis      -> student_vector vs target_role_vector
  2. Internship Matching     -> student_vector vs internship_requirements_vector
  3. Placement Matching      -> student_vector vs job_requirements_vector

A "skill vector" here is a dict {skill: proficiency_0_to_100}.
Skill names are matched case-insensitively.
"""

import numpy as np
from data.skill_taxonomy import get_all_skills


# Normalize the taxonomy to lowercase so matching is case-insensitive.
ALL_SKILLS = [skill.lower() for skill in get_all_skills()]
SKILL_INDEX = {skill: i for i, skill in enumerate(ALL_SKILLS)}


def to_vector(skill_scores: dict) -> np.ndarray:
    """
    Convert skill scores into a fixed-length numeric vector.

    Example:
        {"python": 80, "react": 60}

    becomes a vector over the complete skill taxonomy.
    """

    vec = np.zeros(len(ALL_SKILLS))

    for skill, score in skill_scores.items():
        normalized_skill = skill.lower().strip()

        if normalized_skill in SKILL_INDEX:
            vec[SKILL_INDEX[normalized_skill]] = score / 100.0

    return vec


def cosine_similarity(vec_a: np.ndarray, vec_b: np.ndarray) -> float:
    """
    Calculate cosine similarity between two skill vectors.
    """

    denom = np.linalg.norm(vec_a) * np.linalg.norm(vec_b)

    if denom == 0:
        return 0.0

    return float(np.dot(vec_a, vec_b) / denom)


def match_score(student_skills: dict, target_skills: dict) -> float:
    """
    Calculate a 0-100 match score between a student's skills
    and a target role/internship/job.
    """

    student_vec = to_vector(student_skills)
    target_vec = to_vector(target_skills)

    sim = cosine_similarity(student_vec, target_vec)

    return round(sim * 100, 1)


def skill_gap(
    student_skills: dict,
    target_skills: dict,
    gap_threshold: int = 15
):
    """
    Calculate skill gaps between the student's current skill level
    and the required target skill level.

    Skill names are matched case-insensitively.

    Returns:
        [
            {
                "skill": "Java",
                "required": 70,
                "current": 40,
                "gap": 30
            }
        ]

    Only gaps greater than gap_threshold are returned.
    Results are sorted by largest gap first.
    """

    # Normalize student's skill names.
    normalized_student_skills = {
        skill.lower().strip(): score
        for skill, score in student_skills.items()
    }

    gaps = []

    for skill, required_level in target_skills.items():

        normalized_skill = skill.lower().strip()

        current_level = normalized_student_skills.get(
            normalized_skill,
            0
        )

        gap = required_level - current_level

        if gap > gap_threshold:
            gaps.append({
                "skill": skill,
                "required": required_level,
                "current": current_level,
                "gap": gap
            })

    return sorted(
        gaps,
        key=lambda item: -item["gap"]
    )


def rank_opportunities(
    student_skills: dict,
    opportunities: list
):
    """
    Rank internships or jobs according to skill match.

    Expected opportunity format:

        {
            "id": 1,
            "title": "Frontend Intern",
            "required_skills": {
                "react": 70,
                "javascript": 60
            }
        }
    """

    ranked = []

    for opportunity in opportunities:

        score = match_score(
            student_skills,
            opportunity["required_skills"]
        )

        ranked.append({
            **opportunity,
            "match_score": score
        })

    return sorted(
        ranked,
        key=lambda opportunity: -opportunity["match_score"]
    )


if __name__ == "__main__":

    student = {
        "python": 80,
        "react": 60,
        "embedded c": 50,
        "esp32": 70
    }

    target_role = {
        "python": 90,
        "react": 80,
        "sql": 70,
        "machine learning": 60
    }

    print(
        "Match score vs target role:",
        match_score(student, target_role),
        "%"
    )

    print("\nSkill gaps:")

    for gap in skill_gap(student, target_role):
        print(" -", gap)

    internships = [
        {
            "id": 1,
            "title": "Frontend Intern",
            "required_skills": {
                "react": 70,
                "javascript": 60
            }
        },
        {
            "id": 2,
            "title": "Embedded Systems Intern",
            "required_skills": {
                "embedded c": 60,
                "esp32": 60
            }
        },
        {
            "id": 3,
            "title": "ML Intern",
            "required_skills": {
                "python": 80,
                "machine learning": 70
            }
        }
    ]

    print("\nRanked internships:")

    for result in rank_opportunities(student, internships):
        print(
            f" - {result['title']}: "
            f"{result['match_score']}%"
        )