from pydantic import BaseModel
from typing import List,Optional

#Model 1
class ExtractionResponse(BaseModel):
    text:str
    char_count:int
#Model 2
class AnalysisRequest(BaseModel):
    resume_text:str
    job_description: Optional[str]=None
#Model 3
class AnalysisResponse(BaseModel):
    ats_score: int                    # 0-100
    skills_found: List[str]
    missing_skills: List[str]
    improvement_suggestions: List[str]
    experience_level: str             # junior / mid / senior
    summary: str
#Model 4
class ErrorResponse(BaseModel):
    detail: str
    error_code: str
