from fastapi import FastAPI, UploadFile, File, HTTPException
import io
from services.extractor import extract_resume_text
from models import ExtractionResponse
import json
from services.llm import analyze_resume
from models import AnalysisRequest, AnalysisResponse

app = FastAPI()

@app.get("/health")
def health():
    return{"status":"ok"}

@app.post("/upload")
async def Upload_resume(file:UploadFile = File(...)):
    #validate file types
    allowed_types = ["application/pdf",
                     "application/vnd.openxmlformats-officedocument"
                     ".wordprocessingml.document"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400,
                            detail = "Only PDF and DOCX Files are allowed")

    #validate the file size(max=5MB)
    contents = await file.read()
    if len(contents)>5*1024*1024:
        raise HTTPException(status_code=400,
                            detail="File size is too large.Max 5MB")
    
    return{
        "filename":file.filename,
        "content_type":file.content_type,
        "size_bytes":len(contents)
    }
@app.post("/extract",response_model=ExtractionResponse)
async def extract(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        text = extract_resume_text(contents, file.content_type)
        return {"text": text, "char_count": len(text)}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
@app.post("/analyze", response_model=AnalysisResponse)
async def analyze(request: AnalysisRequest):
    try:
        raw_json = analyze_resume(
            request.resume_text,
            request.job_description
        )

        print("JSON TO PARSE:")
        print(raw_json)

        data = json.loads(raw_json)

        return AnalysisResponse(**data)

    except json.JSONDecodeError as e:
        print("JSON ERROR:", e)
        print("RAW RESPONSE:", raw_json)

        raise HTTPException(
            status_code=500,
            detail="LLM returned invalid JSON"
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )