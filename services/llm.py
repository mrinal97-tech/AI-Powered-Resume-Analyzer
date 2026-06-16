import anthropic
import os
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are an expert ATS (Applicant Tracking System) analyst
and senior career coach. When given a resume, analyze it and return ONLY a
valid JSON object with exactly these fields:

{
  "ats_score": <integer 0-100>,
  "skills_found": [<list of strings>],
  "missing_skills": [<list of strings>],
  "improvement_suggestions": [<list of 3-5 specific strings>],
  "experience_level": "<junior|mid|senior>",
  "summary": "<2-3 sentence plain English summary>"
}

Rules:
- Return ONLY the JSON object. No explanation. No markdown. No extra text.
- ats_score: 0=completely unoptimized, 100=perfectly ATS-optimized
- skills_found: every technical and soft skill you detect
- missing_skills: common skills for this experience level that are absent
- improvement_suggestions: specific, actionable, prioritized by impact
- experience_level: based on years and seniority of roles described
"""

def analyze_resume(resume_text: str,
                   job_description: str = None) -> str:
    """Call Claude and return raw JSON string."""

    user_content = f"Resume:\n{resume_text}"
    if job_description:
        user_content += f"\n\nJob Description:\n{job_description}"

    message = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_content}]
    )
    return message.content[0].text