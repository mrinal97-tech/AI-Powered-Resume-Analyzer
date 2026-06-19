import google.generativeai as genai
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create Gemini model
model = genai.GenerativeModel("gemini-2.5-flash")

SYSTEM_PROMPT = """
You are an expert ATS (Applicant Tracking System) analyst and senior career coach.

When given a resume, analyze it and return ONLY a valid JSON object with exactly these fields:

{
  "ats_score": <integer 0-100>,
  "skills_found": [<list of strings>],
  "missing_skills": [<list of strings>],
  "improvement_suggestions": [<list of strings>],
  "experience_level": "<junior|mid|senior|unknown>",
  "summary": "<plain English summary>"
}

Rules:
- Return ONLY the JSON object.
- No markdown.
- No explanations.
- No code blocks.
- No extra text before or after the JSON.
- ats_score must be an integer between 0 and 100.
- skills_found must contain ONLY skills explicitly mentioned in the resume.
- Do NOT invent, assume, or hallucinate skills that are not present.
- missing_skills should be based on the provided resume and job description.
- improvement_suggestions must be specific and actionable.
- experience_level should be inferred only from information explicitly present in the resume.
- summary should be 2-3 sentences based only on the provided information.

IMPORTANT:

If the resume contains some information (skills, projects, experience, education, certifications, technologies, achievements, etc.), analyze whatever information is available.

Do NOT reject a resume simply because it is short.

Only return the following insufficient-information response when the resume contains almost no meaningful information (for example: fewer than 10 words, placeholder text, or no identifiable skills, projects, experience, education, or technologies)


{
  "ats_score": 0,
  "skills_found": [],
  "missing_skills": [],
  "improvement_suggestions": [
    "Insufficient resume information provided"
  ],
  "experience_level": "unknown",
  "summary": "Resume text is too short to analyze."
}
When calculating ats_score:

- 90-100: Detailed professional resume with strong evidence of impact.
- 70-89: Good resume with relevant skills but missing detail or achievements.
- 40-69: Some relevant skills but significant gaps.
- 0-39: Poorly optimized or insufficient information.

Do not assign scores above 90 unless substantial evidence is present.
"""

def analyze_resume(
    resume_text: str,
    job_description: str = None
) -> str:

    user_content = f"Resume:\n{resume_text}"

    if job_description:
        user_content += f"\n\nJob Description:\n{job_description}"

    prompt = f"""
{SYSTEM_PROMPT}

{user_content}
"""

    try:
    # Validate minimum resume length
     if len(resume_text.split()) < 10:
        raise ValueError(
            "Resume text too short for meaningful analysis."
        )

     response = model.generate_content(prompt)

     text = response.text.strip()

     print("\n===== RAW GEMINI RESPONSE =====")
     print(text)
     print("==============================\n")

     # Remove markdown if Gemini adds it
     text = text.replace("```json", "")
     text = text.replace("```", "")
     text = text.strip()

     return text

    except Exception as e:
     raise ValueError(f"Gemini API Error: {str(e)}")
   
# ==========================================
# STREAMING VERSION
# ==========================================

def stream_analysis(
    resume_text: str,
    job_description: str = None
):
    """
    Streams Gemini response chunk by chunk.
    """

    if len(resume_text.split()) < 5:
        yield "Resume text too short for analysis."
        return

    user_content = f"Resume:\n{resume_text}"

    if job_description:
        user_content += (
            f"\n\nJob Description:\n{job_description}"
        )

    prompt = f"""
{SYSTEM_PROMPT}

{user_content}
"""

    try:

        response = model.generate_content(
            prompt,
            stream=True
        )

        for chunk in response:
          if hasattr(chunk, "text") and chunk.text:
            print("STREAM CHUNK:", repr(chunk.text))
            yield chunk.text

    except Exception as e:

        yield f"\nError: {str(e)}"