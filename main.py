from fastapi import FastAPI, UploadFile, File, HTTPException
import io

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