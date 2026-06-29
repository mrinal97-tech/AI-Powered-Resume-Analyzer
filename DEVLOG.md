# DEVLOG - AI Resume Analyzer

## Project Goal

Build an AI-powered Resume Analyzer using FastAPI that can:

* Accept resume uploads (PDF and DOCX)
* Extract text from resumes
* Analyze skills and experience
* Generate resume scores
* Provide AI-powered feedback

---

# Day 1 - Project Setup

## Objectives

* Set up project structure
* Learn FastAPI basics
* Create first API endpoint

## Tasks Completed

### Created Virtual Environment

```bash
python -m venv venv
```

### Installed FastAPI and Uvicorn

```bash
pip install fastapi uvicorn
```

### Created First FastAPI Application

```python
from fastapi import FastAPI

app = FastAPI()
```

### Created Health Check Endpoint

```python
@app.get("/health")
def health():
    return {"status": "ok"}
```

### Started Server

```bash
uvicorn main:app --reload
```

## Learnings

* FastAPI uses decorators for routing.
* `@app.get()` creates GET endpoints.
* JSON responses are automatically serialized.
* Swagger documentation is generated automatically.

## Challenges

Initially faced environment configuration issues while setting up dependencies.

---

# Day 2 - File Upload API

## Objectives

* Learn FastAPI file uploads
* Validate uploaded files
* Implement upload endpoint

## Tasks Completed

### Installed Required Dependencies

```bash
pip install python-multipart
```

### Learned UploadFile

```python
from fastapi import UploadFile
```

### Created Upload Endpoint

```python
@app.post("/upload")
async def upload_resume(file: UploadFile):
```

### Implemented File Type Validation

Allowed:

* PDF
* DOCX

Blocked:

* EXE
* ZIP
* Other unsupported files

### Implemented File Size Validation

Maximum allowed size:

```text
5 MB
```

### Tested Upload API Using Swagger

```text
http://127.0.0.1:8000/docs
```

Successfully uploaded:

```text
Resume_Mrinal_Kadam.pdf
```

## Learnings

* Difference between GET and POST requests.
* Multipart form data handling.
* Async file processing using `await`.
* FastAPI validation techniques.

## Challenges

Encountered error:

```text
Form data requires "python-multipart" to be installed
```

### Resolution

Installed:

```bash
pip install python-multipart
```

---

# Day 3 - Environment Troubleshooting

## Objectives

* Resolve runtime issues
* Understand Python version compatibility

## Problems Encountered

FastAPI application failed to start correctly.

Investigation revealed:

```text
Python 3.14
```

was being used.

Some FastAPI ecosystem packages were not fully stable with Python 3.14.

## Solution

Installed:

```text
Python 3.12
```

Created a new virtual environment.

Reinstalled dependencies.

Successfully launched application.

## Learnings

* Importance of version compatibility.
* Benefits of isolated virtual environments.
* Different projects can use different Python versions.

---

# Day 4 - GitHub Workflow

## Objectives

* Learn version control
* Push project to GitHub

## Commands Learned

Check project status:

```bash
git status
```

Stage files:

```bash
git add .
```

Commit changes:

```bash
git commit -m "Added resume upload API"
```

Push to GitHub:

```bash
git push origin main
```

## Learnings

* Difference between local and remote repositories.
* Importance of meaningful commit messages.
* GitHub as a project showcase platform.

---

# Technical Concepts Learned

## FastAPI

* Application creation
* Routing
* GET requests
* POST requests
* Async functions
* File uploads
* Validation
* HTTP exceptions
* Swagger documentation

## Python

* Virtual environments
* Package management
* Dependency installation
* Async programming basics

## Git

* Repository management
* Commits
* Push workflow

---

# Current Project Status

Completed:

* FastAPI setup
* Health endpoint
* Upload endpoint
* File validation
* Swagger testing
* GitHub integration

In Progress:

* PDF text extraction
* DOCX text extraction

Upcoming Features:

* Skill extraction
* Resume scoring
* ATS compatibility analysis
* AI-powered resume feedback
* Job-role matching

---

# Reflection

This project marks the beginning of my backend development journey using FastAPI.

Key lessons learned:

* Building APIs is easier when functionality is developed incrementally.
* Debugging environment issues is a significant part of backend development.
* Version control should be used from the beginning of every project.
* FastAPI provides an excellent developer experience through automatic documentation and validation.

The next milestone is extracting text from uploaded resumes and building the first version of the resume analysis engine.
# Day 3 - PDF and DOCX Text Extraction

## Goal

Enable the application to extract readable text from uploaded resumes.

Before this stage, the API could only:

* Receive resume files
* Validate file type
* Validate file size

The application could not understand the contents of the resume.

The objective was to convert uploaded PDF and DOCX files into plain text that can later be analyzed for skills, experience, education, and ATS scoring.

---

## New Project Structure

Created:

```text
services/
└── extractor.py
```

This separates document-processing logic from API routes.

Benefits:

* Cleaner code organization
* Easier testing
* Reusable extraction functions
* Better scalability

---

## PDF Text Extraction

Implemented:

```python
def extract_text_from_pdf(file_bytes: bytes) -> str:
```

### Workflow

```text
PDF File
    ↓
Bytes
    ↓
BytesIO Stream
    ↓
pdfplumber
    ↓
Page Iteration
    ↓
Extract Text
    ↓
Combine Pages
```

### Key Concepts Learned

#### BytesIO

```python
io.BytesIO(file_bytes)
```

Converts raw bytes into a file-like object.

This allows pdfplumber to process uploaded files without saving them to disk.

#### Page-by-Page Processing

```python
for page in pdf.pages:
```

Each PDF page is processed independently.

#### Text Extraction

```python
page.extract_text()
```

Returns readable text from the page.

Example:

```text
Mrinal Kadam
Computer Engineering Student
Skills: Python, React, FastAPI
```

---

## DOCX Text Extraction

Implemented:

```python
def extract_text_from_docx(file_bytes: bytes) -> str:
```

### Workflow

```text
DOCX File
    ↓
Bytes
    ↓
BytesIO Stream
    ↓
python-docx
    ↓
Paragraph Extraction
    ↓
Combine Text
```

### Key Concepts Learned

Open DOCX directly from memory:

```python
docx.Document(io.BytesIO(file_bytes))
```

Extract paragraphs:

```python
for para in doc.paragraphs
```

Ignore empty lines:

```python
if para.text.strip()
```

---

## Unified Extraction Interface

Implemented:

```python
def extract_resume_text(file_bytes, content_type):
```

Purpose:

Route uploaded files to the correct extraction function.

Logic:

```text
PDF
 ↓
extract_text_from_pdf()

DOCX
 ↓
extract_text_from_docx()
```

This creates a single entry point for future resume processing.

---

## Error Handling

Implemented:

```python
try:
    ...
except Exception:
```

Benefits:

* Prevents application crashes
* Returns meaningful error messages
* Simplifies debugging

Example:

```text
PDF extraction failed
DOCX extraction failed
```

---

## Handling Empty Documents

Implemented:

```python
if not text.strip():
```

Possible reasons:

* Scanned PDF
* Image-only document
* Corrupted file

Returned message:

```text
No text found.
File may be a scanned image.
Please use a text-based PDF.
```

---

## Architecture Improvement

Current Flow:

```text
User Uploads Resume
         ↓
Validation
         ↓
Read File Bytes
         ↓
Text Extraction
         ↓
Plain Text
```

Future Flow:

```text
User Uploads Resume
         ↓
Validation
         ↓
Text Extraction
         ↓
Skill Detection
         ↓
Experience Analysis
         ↓
Resume Scoring
         ↓
AI Feedback
```

---

## Challenges Faced

### Understanding File Bytes

Initially unclear how uploaded files could be processed without saving them locally.

Learned:

```python
io.BytesIO()
```

creates an in-memory file object.

### PDF Complexity

Not all PDFs contain selectable text.

Some PDFs are actually images.

These require OCR solutions such as:

* Tesseract OCR
* EasyOCR

This feature will be considered in future versions.

---

## Technical Concepts Learned

### Python

* Bytes
* Streams
* BytesIO
* Exception Handling

### FastAPI

* UploadFile
* Async File Reading

### Libraries

* pdfplumber
* python-docx

### Software Design

* Separation of Concerns
* Service Layer Architecture

---

## Project Status

Completed:

* FastAPI setup
* Health endpoint
* Upload endpoint
* File validation
* PDF extraction
* DOCX extraction

Next Steps:

* Connect extractor to upload endpoint
* Return extracted text preview
* Implement skill extraction
* Build resume scoring engine

---

## Reflection

This was the first stage where the application started processing resume content rather than simply receiving files.

The project evolved from a file-upload API into a document-processing system.

This milestone lays the foundation for future AI-powered resume analysis features.
# Day 4 - Pydantic Models and Project Structure

## Goal

Introduce structured request and response models using Pydantic and improve project organization by separating data contracts from business logic.

Before this stage, the application could:

* Upload resumes
* Validate files
* Extract text from PDF and DOCX files

However, there was no formal structure defining what data should enter or leave the API.

The goal was to create typed request/response contracts and organize the project following backend development best practices.

---

# Objectives

* Learn Pydantic BaseModel
* Create reusable request and response models
* Understand type validation
* Improve project architecture
* Prepare the application for future AI analysis features

---

# Created models.py

Created a dedicated file:

```text
models.py
```

Purpose:

* Store all API request models
* Store all API response models
* Centralize data validation
* Improve maintainability

---

# Learned Pydantic

Imported:

```python
from pydantic import BaseModel
```

Pydantic provides:

* Automatic validation
* Type checking
* API schema generation
* Swagger documentation support

Example:

```python
class User(BaseModel):
    name: str
    age: int
```

Invalid data is automatically rejected.

---

# ExtractionResponse Model

Implemented:

```python
class ExtractionResponse(BaseModel):
    text: str
    char_count: int
```

Purpose:

Represent the result of resume text extraction.

Example Response:

```json
{
  "text": "Mrinal Kadam\nPython Developer",
  "char_count": 32
}
```

Benefits:

* Standardized extraction output
* Easier frontend integration
* Automatic documentation

---

# AnalysisRequest Model

Implemented:

```python
class AnalysisRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = None
```

Purpose:

Define the input expected by the future resume analysis engine.

Fields:

resume_text

* Extracted resume text
* Required

job_description

* Job description text
* Optional
* Used for ATS matching

Example:

```json
{
  "resume_text": "Python React FastAPI",
  "job_description": "Looking for Python Developer"
}
```

Learned:

* Optional fields
* Default values
* Input validation

---

# AnalysisResponse Model

Implemented:

```python
class AnalysisResponse(BaseModel):
    ats_score: int
    skills_found: List[str]
    missing_skills: List[str]
    improvement_suggestions: List[str]
    experience_level: str
    summary: str
```

Purpose:

Define the final output of the AI Resume Analyzer.

Fields:

ATS Score

* Resume compatibility score
* Range: 0-100

Skills Found

* Skills detected in resume

Missing Skills

* Important skills missing from resume

Improvement Suggestions

* Actionable recommendations

Experience Level

* junior
* mid
* senior

Summary

* AI-generated evaluation summary

Example:

```json
{
  "ats_score": 82,
  "skills_found": [
    "Python",
    "React",
    "FastAPI"
  ],
  "missing_skills": [
    "Docker",
    "AWS"
  ],
  "improvement_suggestions": [
    "Add deployment projects",
    "Include internship achievements"
  ],
  "experience_level": "junior",
  "summary": "Strong entry-level backend developer."
}
```

This model serves as the blueprint for future AI-generated analysis.

---

# ErrorResponse Model

Implemented:

```python
class ErrorResponse(BaseModel):
    detail: str
    error_code: str
```

Purpose:

Create a consistent error format.

Example:

```json
{
  "detail": "No text found in PDF",
  "error_code": "EMPTY_DOCUMENT"
}
```

Benefits:

* Easier frontend handling
* Predictable API behavior
* Better debugging

---

# Type Hinting Concepts Learned

Imported:

```python
from typing import List, Optional
```

Learned:

List[str]

Example:

```python
["Python", "React", "FastAPI"]
```

Optional[str]

Allows:

```python
"Job Description"
```

or

```python
None
```

Benefits:

* Better code readability
* Improved editor support
* Stronger validation

---

# Project Architecture Improvements

Before:

```text
main.py
 ├─ Routes
 ├─ Validation
 ├─ Responses
 ├─ Business Logic
```

After:

```text
resume-analyzer/
│
├── main.py
├── models.py
│
├── services/
│   └── extractor.py
```

Benefits:

* Separation of concerns
* Cleaner codebase
* Easier maintenance
* Better scalability

---

# Key Learnings

## FastAPI

* Response Models
* Request Models
* Data Validation
* Swagger Schema Generation

## Pydantic

* BaseModel
* Type Validation
* Optional Fields
* List Types

## Software Engineering

* Clean Architecture
* Modular Design
* API Contracts
* Separation of Concerns

---

# Challenges

Initially, request and response data were represented as plain dictionaries.

Problems:

* No validation
* No type safety
* Harder to maintain

Pydantic solved these issues by providing structured models and automatic validation.

---

# Current Project Status

Completed:

* FastAPI setup
* Health endpoint
* Resume upload endpoint
* File validation
* PDF extraction
* DOCX extraction
* Pydantic models
* Project restructuring

Upcoming:

* Connect extraction results with models
* Resume analysis service
* Skill extraction
* ATS scoring
* AI-generated recommendations

---

# Reflection

Day 4 was focused on building a stronger foundation rather than adding visible features.

The project became more professional by introducing typed request and response contracts.

This stage prepares the application for future AI analysis features while keeping the codebase organized, scalable, and easier to maintain.
# Day 5 — LLM Integration, API Security, and Provider Migration

## Goal

Integrate a Large Language Model (LLM) into the AI Resume Analyzer to analyze extracted resume text and return structured ATS feedback.

---

## What I Built

### 1. Created LLM Service Layer

Created `services/llm.py` to isolate all AI-related logic from the API routes.

Responsibilities:

* Load API credentials from environment variables
* Connect to the LLM provider
* Send resume text for analysis
* Receive structured JSON output
* Return results to FastAPI endpoints

This follows the software engineering principle of Separation of Concerns, where AI logic is separated from API and business logic.

---

### 2. Designed ATS Analysis Prompt

Created a detailed system prompt instructing the model to return a strict JSON structure.

Expected response format:

```json
{
  "ats_score": 85,
  "skills_found": [],
  "missing_skills": [],
  "improvement_suggestions": [],
  "experience_level": "junior",
  "summary": "..."
}
```

Key learning:

* LLMs perform better with explicit instructions.
* Structured outputs are easier to parse and validate.
* Prompt engineering is critical for reliable AI systems.

---

### 3. Integrated FastAPI with LLM Service

Created `/analyze` endpoint.

Workflow:

Resume Text
↓
FastAPI Endpoint
↓
LLM Service
↓
AI Model
↓
JSON Response
↓
Pydantic Validation
↓
Final API Response

This was the first end-to-end AI-powered feature of the project.

---

### 4. Implemented JSON Parsing and Validation

Used:

```python
json.loads()
```

to convert the model response from a string into a Python dictionary.

Validated the output using:

```python
AnalysisResponse
```

Pydantic model.

Benefits:

* Type safety
* Consistent API responses
* Reduced runtime errors
* Better maintainability

---

## Major Engineering Challenge: Secret Leakage

### What Happened

While integrating the Anthropic API, an API key was accidentally committed into Git history.

GitHub Push Protection immediately blocked the push and reported:

"Push cannot contain secrets"

This was my first experience with GitHub Secret Scanning and Push Protection.

---

### Root Cause

The API key was stored in a tracked file and became part of Git commit history.

Although the file was later removed, GitHub continued blocking the push because the secret still existed in previous commits.

---

### How I Fixed It

1. Added `.env` to `.gitignore`

```gitignore
.env
venv/
__pycache__/
*.pyc
```

2. Removed `.env` from Git tracking.

3. Reset problematic commits.

4. Rebuilt clean commits.

5. Learned how Git history affects repository security.

---

## Security Lessons Learned

Never commit:

* API Keys
* Tokens
* Passwords
* Credentials

Always use:

```python
os.getenv("API_KEY")
```

with environment variables.

Store secrets inside:

```text
.env
```

and ensure:

```text
.env
```

is included in `.gitignore`.

This is a standard industry practice used by backend and AI engineers.

---

## Anthropic API Issue

After implementing Claude integration, I discovered that API usage required funded credits.

Without available credits, the API could not be used for project development and testing.

As a result, I decided to switch providers.

---

## Migration Decision: Anthropic → Google Gemini

Reason:

* Easier access for development
* Free tier availability
* Suitable for learning and prototyping
* Simple API integration

Planned changes:

* Replace Anthropic SDK with Gemini SDK
* Update API configuration
* Reuse existing prompts
* Keep FastAPI architecture unchanged

The abstraction provided by `services/llm.py` makes provider migration straightforward.

---

## Concepts Learned

### Backend Engineering

* API integration
* Environment variables
* HTTP request lifecycle
* Error handling
* JSON processing

### Software Engineering

* Separation of concerns
* Service layer architecture
* Git security practices
* Secret management
* Version control workflows

### AI Engineering

* LLM integration
* Prompt engineering
* Structured outputs
* JSON validation
* AI provider abstraction

---

## Project Status

Completed:

* File Upload API
* PDF Extraction
* DOCX Extraction
* Pydantic Models
* FastAPI Validation
* LLM Service Layer
* Analyze Endpoint

Next:

* Gemini API Integration
* Resume Analysis Pipeline
* ATS Scoring Improvements
* Job Description Matching
* Production-Level Error Handling

# Day 6 — Gemini LLM Integration, Debugging, Security Fixes & ATS Analysis

# Goal
Integrate a production-ready LLM into the Resume Analyzer, generate structured ATS feedback, handle API authentication securely, and return validated JSON responses.

# Objectives
- Connect FastAPI application with an LLM
- Generate ATS analysis from resume text
- Return structured JSON output
- Secure API keys using environment variables
- Fix GitHub secret scanning issues
- Migrate from Claude to Gemini
- Handle JSON parsing errors
- Improve prompt engineering
- Reduce hallucinations
- Add resume validation

# Tasks Completed

1. Created LLM Service Layer

services/
└── llm.py

Purpose: Keep AI logic separate from API routes.

Architecture:
main.py
    ↓
services/llm.py
    ↓
Gemini API

Benefits: Clean architecture, easy provider migration, better code maintainability, reusable AI service.

# 2. Added Environment Variables

Created .env
GEMINI_API_KEY=your_api_key

Loaded variables:
from dotenv import load_dotenv
load_dotenv()

Learned: Never hardcode API keys inside source code.

# 3. Claude API Integration Attempt

Initially integrated:
import anthropic
client = anthropic.Anthropic(...)

Implemented analyze_resume() using client.messages.create(...) to send resume text to Claude and receive ATS analysis.

# Error 1 — Authentication Failure
Error:
{
  "detail": "Could not resolve authentication method"
}
Cause: Claude API key not found. Application could not authenticate.
Solution: Created .env, added ANTHROPIC_API_KEY=..., loaded using load_dotenv()
Result: Authentication successful.

# Error 2 — Claude Billing Limitation
Problem: Claude API key existed but account had no usable credits.
Impact: Could not continue development.
Decision: Switch AI provider — Claude → Gemini
Reason: Easier access, free tier available, faster experimentation.

# 4. Migrated To Gemini

Installed:
pip install google-generativeai

Configured:
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

Created:
model = genai.GenerativeModel(...)

Implemented:
response = model.generate_content(prompt)

Learned: Most AI applications use exactly this pattern:
Input → Prompt → LLM → Response

# Error 3 — Invalid Gemini Model
Error:
404 models/gemini-1.5-flash is not found
Cause: Requested model unavailable.
Investigation: Created test_models.py
for model in genai.list_models():
    print(model.name)
Discovered: models/gemini-2.5-flash, models/gemini-2.5-pro, models/gemini-2.0-flash, ...
Fix: Updated model="gemini-2.5-flash"
Result: Model successfully loaded.

# Error 4 — GitHub Push Protection
Problem: Accidentally committed .env containing API keys.
GitHub Error:
GH013: Repository rule violations found
Push cannot contain secrets
Anthropic API Key detected
Cause: Sensitive credentials existed in Git history.
Solution: 
git rm --cached .env
Updated .gitignore:
.env
venv/
__pycache__/
*.pyc
Committed cleanup.
Important Lesson: Never commit API keys, passwords, tokens, or credentials. Even deleted files remain inside Git history.

# Error 5 — Secret Still Found
Problem: Even after deleting .env, GitHub continued blocking pushes.
Cause: Secret existed in previous commit history. GitHub scans current commit + previous commits.
Investigation: Used git log --oneline, reviewed commit history, performed git reset HEAD~1, created clean commits.
Result: Secret removed successfully.

# Error 6 — Git Authentication Failure
Error:
Invalid username or token.
Password authentication is not supported.
Cause: GitHub no longer supports password authentication.
Solution: Reauthenticated GitHub account, removed old credentials, used GitHub login flow again.
Result: Push successful.

# 5. Built ATS Analysis Endpoint

Created:
@app.post("/analyze")

Flow:
Resume Text → Gemini → JSON → Pydantic Validation → Response

# 6. Structured JSON Output

Created prompt requiring:
{
  "ats_score": 0,
  "skills_found": [],
  "missing_skills": [],
  "improvement_suggestions": [],
  "experience_level": "",
  "summary": ""
}

Benefits: Machine readable, predictable output, API friendly.

Error 7 — Invalid JSON
Error:
{
  "detail": "LLM returned invalid JSON"
}
Cause: Gemini returned the JSON wrapped in markdown code fences instead of pure JSON, so the parser failed.
Solution: Added cleanup:
text = text.replace("```json", "")
text = text.replace("```", "")
Added debugging:
print(response.text)
Result: Valid JSON parsing.

Error 8 — Gemini Rate Limit
Error:
429 Quota exceeded
Cause: Free-tier request limit exceeded — 5 requests/minute.
Solution: Waited for quota reset.
Learned: All production APIs have usage limits.

Error 9 — Hallucinated Skills
Input: "My resume text here"
Problem: Gemini invented skills — Python, AWS, Docker, FastAPI — none of which were provided.
Cause: LLM inference / hallucination.
Solution: Prompt updated: "Do NOT infer or invent skills that are not explicitly mentioned."
Result: More reliable analysis.

Error 10 — Overly Strict Validation
Problem: Resume — "Python developer with FastAPI, React, MongoDB and Docker experience." — returned {"ats_score": 0}
Cause: Prompt rejected short resumes.
Solution: Updated instructions: "Analyze whatever information is available. Do NOT reject a resume simply because it is short."
Result:
{
  "ats_score": 95,
  "skills_found": [
    "Python",
    "FastAPI",
    "React",
    "MongoDB",
    "Docker"
  ]
}

7. Added Resume Validation

Added:
if len(resume_text.split()) < 5:
    raise ValueError("Resume text too short for meaningful analysis.")

Purpose: Prevent unnecessary Gemini API calls.
Benefits: Faster responses, lower API usage, reduced cost, better validation.

Final Working Flow

User Resume
      ↓
FastAPI Endpoint
      ↓
Input Validation
      ↓
Gemini API
      ↓
Structured JSON
      ↓
JSON Parsing
      ↓
Pydantic Validation
      ↓
Final ATS Response

Concepts Learned

Backend Engineering
- FastAPI routing
- Request validation
- Response validation
- Error handling
- Environment variables
- Service layer architecture

AI Engineering
- Prompt engineering
- Structured output
- LLM integration
- Hallucination control
- Response parsing
- Model selection

Software Engineering
- Git workflow
- Secret management
- GitHub Push Protection
- API debugging
- Logging
- Architecture design

Day 6 Outcome

Successfully built a fully functional AI-powered ATS Resume Analyzer capable of:
✅ Accepting resume text
✅ Sending data to Gemini
✅ Generating ATS analysis
✅ Returning structured JSON
✅ Validating responses using Pydantic
✅ Handling API failures
✅ Preventing hallucinations
✅ Managing secrets securely
✅ Following production-style backend architecture

Git Commands Used During Day 6

git add services/llm.py main.py .gitignore
git commit -m "Implement Gemini ATS analysis service"

git rm --cached .env

git add .
git commit -m "Remove secrets and secure environment variables"

git push origin main

git log --oneline

git reset HEAD~1

git status

# Day 7 DevLog — Gemini Streaming Integration & Debugging

## Goal

Implement real-time streaming responses from the LLM so users can start receiving ATS analysis immediately instead of waiting for the complete response.

---

## Tasks Completed

### 1. Added Streaming Endpoint

Created a new FastAPI endpoint:

```python
@app.post("/analyze/stream")
async def analyze_stream(request: AnalysisRequest):
    return StreamingResponse(
        stream_analysis(
            request.resume_text,
            request.job_description
        ),
        media_type="text/plain"
    )
```

Purpose:

* Enable real-time LLM output.
* Improve perceived performance.
* Mimic ChatGPT-like typing behavior.
* Learn FastAPI streaming architecture.

---

### 2. Implemented Gemini Streaming Generator

Created a generator function inside `services/llm.py`.

```python
def stream_analysis(resume_text, job_description=None):

    response = model.generate_content(
        prompt,
        stream=True
    )

    for chunk in response:
        yield chunk.text
```

Purpose:

* Receive partial responses from Gemini.
* Yield chunks immediately.
* Reduce waiting time for end users.
* Understand Python generators and streaming APIs.

---

### 3. Learned Streaming Architecture

Normal Flow:

User
→ FastAPI
→ Gemini
→ Complete Response
→ User

Streaming Flow:

User
→ FastAPI
→ Gemini
→ Chunk 1
→ Chunk 2
→ Chunk 3
→ User receives output continuously

This architecture is used by:

* ChatGPT
* Claude
* Cursor
* GitHub Copilot
* Windsurf

---

## Errors Encountered

### Error 1: Streaming Response Appeared All At Once

Expected:

```text
ATS Score...
Skills...
Suggestions...
```

appearing gradually.

Actual:

Entire response appeared after generation completed.

Example:

```text
This is a good start...
Here's ATS feedback...
```

displayed all at once.

---

### Root Cause Investigation

Initially suspected:

* Gemini not streaming
* Generator not working
* FastAPI buffering response

Added debugging:

```python
print(chunk.text)
```

to verify whether Gemini was producing chunks.

---

### Discovery

The issue was not FastAPI.

The issue was testing through Swagger UI:

```text
http://127.0.0.1:8000/docs
```

Swagger buffers the response before displaying it.

Therefore:

Backend Streaming = Working

Frontend Display = Buffered

Result:

Streaming could not be visually observed inside Swagger.

---

### Solution

Use:

```bash
curl -N
```

instead of Swagger.

Example:

```bash
curl -N -X POST http://127.0.0.1:8000/analyze/stream
```

The `-N` flag disables buffering and allows streamed chunks to be displayed immediately.

---

### Error 2: Response Returned ATS Report Instead of JSON

Expected:

```json
{
  "ats_score": 82
}
```

Received:

```text
This is a good start...
Strong matches...
Missing keywords...
```

---

### Root Cause

Streaming endpoint was using a different prompt than the JSON endpoint.

Normal endpoint:

```python
SYSTEM_PROMPT
```

Streaming endpoint:

```python
Analyze this resume and provide ATS feedback
```

Gemini therefore returned human-readable text.

---

### Solution

Use the same SYSTEM_PROMPT if JSON streaming is required.

Alternatively:

Keep two endpoints:

```text
/analyze
```

Structured JSON output.

```text
/analyze/stream
```

Human-readable streaming output.

This is the preferred production design.

---

### Error 3: Understanding Chunking

Initially assumed chunking means:

```text
Sentence 1
Sentence 2
Sentence 3
```

arrive separately.

Learned that chunking actually means:

```text
Token
Token
Token
```

or

```text
Small text fragments
```

generated incrementally by the model.

Example:

Chunk 1:

```text
ATS
```

Chunk 2:

```text
 Score
```

Chunk 3:

```text
: 85
```

---

## Concepts Learned

### StreamingResponse

Used for sending data incrementally.

```python
StreamingResponse(generator())
```

instead of:

```python
return response
```

---

### Python Generators

A generator produces values one at a time.

Example:

```python
yield chunk.text
```

instead of:

```python
return chunk.text
```

This enables streaming.

---

### Perceived Latency

Even if total generation time remains 10 seconds:

Without Streaming:

User waits 10 seconds.

With Streaming:

User sees output after 1 second.

This improves user experience significantly.

---

## Engineering Learnings

Backend Engineering:

* Streaming APIs
* Response buffering
* FastAPI StreamingResponse
* Generator functions

AI Engineering:

* Token generation
* LLM streaming
* Real-time AI interactions

Software Engineering:

* User experience optimization
* Perceived performance improvements
* Production-grade API design

---

## Outcome

Successfully implemented Gemini streaming architecture and understood how modern AI systems deliver responses in real time.

The Resume Analyzer now supports both:

1. Structured JSON analysis endpoint.
2. Real-time streaming analysis endpoint.

This architecture closely resembles production systems used in modern AI applications.

# Week 1 Summary — June 2026

## What I Built

### Backend Foundation (FastAPI)

* Set up a FastAPI backend project structure.
* Created and tested API endpoints:

  * `/health`
  * `/upload`
  * `/extract`
  * `/analyze`
  * `/analyze/stream`
* Learned request handling, response models, and API testing using Swagger UI.

### Resume Text Extraction

* Implemented PDF text extraction using `pdfplumber`.
* Implemented DOCX text extraction using `python-docx`.
* Built a unified extraction service that:

  * Detects file type.
  * Routes to the correct extractor.
  * Returns plain resume text.
* Added validation for scanned or empty documents.

### Pydantic Models

* Created strongly typed request and response models.
* Added:

  * `AnalysisRequest`
  * `AnalysisResponse`
  * `ExtractionResponse`
  * `ErrorResponse`
* Learned how FastAPI performs automatic validation and API documentation generation using Pydantic.

### LLM Integration

* Initially integrated Anthropic Claude API.
* Designed a structured ATS analysis prompt.
* Implemented JSON-only responses for:

  * ATS score
  * Skills found
  * Missing skills
  * Improvement suggestions
  * Experience level
  * Resume summary

### Gemini Migration

* Discovered that Anthropic API requires billing/funding before usage.
* Migrated the entire LLM service from Claude to Gemini.
* Updated API integration logic.
* Tested Gemini model availability and compatibility.
* Implemented JSON parsing and response validation.

### Streaming Endpoint

* Implemented `/analyze/stream`.
* Learned FastAPI `StreamingResponse`.
* Learned Python generators and `yield`.
* Implemented Gemini streaming responses.
* Studied how ChatGPT, Claude, Cursor, and Copilot use streaming.

### Git & GitHub Workflow

* Practiced:

  * `git add`
  * `git commit`
  * `git push`
  * `git reset`
  * `git rm --cached`
  * `git status`
  * `git log`
* Managed project version control independently.

---

## Errors I Hit and Fixed

### 1. Anthropic Authentication Error

Error:

```text
Could not resolve authentication method
```

Cause:

* API key not loaded properly.

Solution:

* Used `.env`.
* Added `load_dotenv()`.
* Verified environment variable loading.

---

### 2. Anthropic Billing Restriction

Error:

```text
Claude API key valid but requests fail
```

Cause:

* Anthropic requires funded account for API usage.

Solution:

* Migrated to Gemini API.

---

### 3. Gemini Model Not Found

Error:

```text
404 model not found
```

Cause:

* Using outdated model name.

Solution:

* Listed available Gemini models.
* Switched to supported model.

---

### 4. Invalid JSON From LLM

Error:

```text
LLM returned invalid JSON
```

Cause:

* Gemini sometimes returned markdown or extra text.

Solution:

* Strengthened system prompt.
* Added JSON cleanup logic.
* Added parsing validation.

---

### 5. Resume Too Short

Problem:

* Small test resumes produced unrealistic results.

Solution:

* Added validation rules.
* Improved prompt instructions.
* Added insufficient-information fallback response.

---

### 6. GitHub Secret Scanning Failure

Error:

```text
GH013: Push cannot contain secrets
```

Cause:

* Accidentally committed `.env` file containing API key.

Solution:

* Removed `.env`.
* Added `.env` to `.gitignore`.
* Reset commits.
* Cleaned Git history.
* Recommitted safely.

---

### 7. Git Authentication Failure

Error:

```text
Invalid username or token
```

Cause:

* GitHub password authentication removed.

Solution:

* Reauthenticated Git.
* Updated credentials.

---

### 8. Streaming Appeared Not To Work

Problem:

* Entire response appeared at once.

Cause:

* Testing inside Swagger UI.
* Swagger buffers responses.

Solution:

* Learned to test streaming using `curl -N`.
* Added chunk debugging.

---

### 9. ATS Analysis Hallucination

Problem:

* LLM inferred skills not explicitly present.

Solution:

* Updated system prompt:

  * Only use explicit skills.
  * Do not invent technologies.
  * Do not hallucinate experience.

---

## What Surprised Me

* FastAPI automatically generates API documentation.
* Pydantic performs validation with very little code.
* LLM prompts require careful engineering to avoid hallucinations.
* Most production AI systems depend heavily on prompt design.
* Streaming is more complex than simply setting `stream=True`.
* GitHub secret scanning is extremely strict and can block pushes.
* A single leaked API key can prevent deployment.
* Backend debugging often takes longer than writing the actual feature.
* Understanding the flow of data is more important than writing code quickly.

---

## What I Still Don't Fully Understand

### Backend

* Async programming (`async` vs `sync`) in depth.
* FastAPI dependency injection.
* Middleware architecture.
* Background tasks.
* Authentication and authorization systems.
* Database integration using SQLAlchemy.

### AI Engineering

* Tokenization inside LLMs.
* How Gemini generates tokens internally.
* Embeddings and vector databases.
* RAG (Retrieval-Augmented Generation).
* Context window management.
* Model fine-tuning.

### Software Engineering

* Production deployment architecture.
* Docker containers.
* CI/CD pipelines.
* Kubernetes.
* Microservices communication.
* System design for large-scale applications.

### Streaming

* Server-Sent Events (SSE).
* WebSockets.
* Why buffering happens in some clients.
* Real-time frontend streaming implementation.

---

## Next Week Goal

### Frontend Development

* Start React frontend.
* Learn React component architecture.
* Create ATS Dashboard UI.

### Integration

* Connect React frontend with FastAPI backend.
* Connect file upload UI to `/extract`.
* Display extracted resume text.
* Connect analysis results to frontend.

### Features

* Upload resume directly from browser.
* View extracted text before analysis.
* Show ATS score visually.
* Display missing skills and recommendations.
* Build a professional dashboard.

### Learning Goals

* React Hooks.
* API integration using Axios.
* State management.
* Frontend file handling.
* End-to-end Resume Analyzer workflow.

---

## Week 1 Outcome

Successfully built the complete backend foundation of the AI-Powered Resume Analyzer, including document extraction, structured ATS analysis, Gemini integration, streaming support, and GitHub version control. Gained practical experience in FastAPI, Pydantic, API design, prompt engineering, debugging, environment management, and production development workflows.

# Dev Log – Day 8
## Tasks Completed

### 1. Resume Upload Module

* Implemented drag-and-drop resume upload functionality using React Dropzone.
* Added support for PDF and DOCX file formats.
* Restricted uploads to a single file at a time.
* Added file validation for supported document types.

### 2. Backend Integration

* Connected frontend upload component with backend API endpoint (`/extract`) using Axios.
* Implemented FormData-based file transfer from frontend to backend.
* Successfully sent uploaded resumes to the extraction service.

### 3. UI State Management

* Added upload status handling:

  * Idle
  * Uploading
  * Success
  * Error
* Displayed user-friendly messages for each state.
* Improved drag-and-drop visual feedback using Tailwind CSS.

### 4. Error Handling

* Added API error handling using try-catch blocks.
* Displayed backend error messages on the frontend.
* Improved debugging by analyzing upload and API response failures.

### 5. GitHub Repository Maintenance

* Resolved GitHub Push Protection issue caused by accidentally committing API keys in the `.env` file.
* Added `.env` to `.gitignore`.
* Removed tracked secrets from Git history.
* Updated repository to follow secure credential management practices.

## Concepts Learned

* FormData and multipart/form-data.
* File upload workflow in React.
* Axios POST requests for file transfer.
* Frontend-to-backend communication.
* Git secret scanning and GitHub Push Protection.

## Challenges Faced

* MIME type configuration errors in React Dropzone.
* Understanding FormData and multipart request structure.
* GitHub push rejection due to exposed API keys.

## Solutions Implemented

* Corrected MIME type definitions.
* Studied multipart/form-data request flow.
* Removed sensitive files from Git tracking and updated `.gitignore`.

## Progress Summary

Today the resume upload pipeline became fully functional. Users can now upload resumes, send them to the backend for processing, and receive extracted text successfully. Security issues related to secret exposure were also addressed.

## Next Steps (Day 9)

* Implement resume text display component.
* Add resume scoring functionality.
* Integrate Gemini/OpenAI analysis.
* Extract skills, education, and experience sections.
* Improve UI/UX and loading indicators.

# Day 9 – Resume Upload UI & Backend Integration

## Goal

Build the frontend upload interface and connect it with the FastAPI backend to extract text from PDF and DOCX resumes.

---

## Tasks Completed

### Resume Upload Interface

* Created the `DropZone.jsx` component using **React Dropzone**.
* Implemented drag-and-drop functionality for uploading resumes.
* Added support for **PDF** and **DOCX** file formats.
* Restricted uploads to a single resume file.

### Backend Integration

* Connected the React frontend with the FastAPI backend using **Axios**.
* Implemented the `POST /extract` endpoint for uploading resumes.
* Successfully extracted resume text and stored it in React state.

### FormData Implementation

* Learned how browsers upload files using `multipart/form-data`.
* Implemented `FormData` for sending resume files to the backend.

### Resume Extraction Workflow

```
User Uploads Resume
        ↓
React Dropzone
        ↓
Axios POST /extract
        ↓
FastAPI Backend
        ↓
PDF/DOCX Text Extraction
        ↓
Extracted Resume Text
        ↓
Stored in React State
```

---

## Errors Encountered & Solutions

### Error 1 – FormData Variable Name

Problem:

* Accidentally declared `FormData` but used `formData`.

Cause:

* JavaScript is case-sensitive.

Solution:

* Corrected the variable name to `formData`.

---

### Error 2 – Upload Stuck at "Extracting text..."

Problem:

* Upload never completed.

Investigation:

* Used browser Console and Network tab.
* Added debugging logs to inspect API requests.

Solution:

* Identified frontend request issues and fixed them.

---

### Error 3 – Undefined API URL

Problem:

* Upload request was sent to:

```
/undefined/extract
```

Cause:

* `VITE_API_URL` was missing.

Solution:

* Created frontend `.env` file.
* Added:

```
VITE_API_URL=http://localhost:8000
```

* Restarted the Vite development server.

---

## Concepts Learned

* React Dropzone
* FormData
* Axios
* File Upload APIs
* React State Management
* Backend Integration
* Browser Developer Tools
* Environment Variables (Vite)

---

## Outcome

Successfully built a resume upload interface capable of uploading PDF and DOCX files, sending them to FastAPI, extracting resume text, and storing the extracted content for AI analysis.

---

# Day 10 – Streaming AI Analysis & CORS Debugging

## Goal

Implement live AI analysis between React, FastAPI, and Gemini while learning streaming architecture.

---

## Tasks Completed

### Streaming Component

* Created `StreamingResult.jsx`.
* Added Analyze button.
* Implemented loading state.
* Connected frontend to FastAPI streaming endpoint.

### Streaming Workflow

```
React
   ↓
FastAPI
   ↓
Gemini
   ↓
StreamingResponse
   ↓
React
```

### Browser Streams

* Used `response.body.getReader()` to receive streamed AI responses.
* Used `TextDecoder()` to convert streamed bytes into readable text.
* Displayed streamed output dynamically using React state.

---

## Errors Encountered & Solutions

### Error 1 – CORS Policy Blocked Request

Problem:

```
Access-Control-Allow-Origin
```

Cause:

* Frontend was running on **localhost:5174**.
* FastAPI only allowed **localhost:5173**.

Solution:

* Added `CORSMiddleware`.
* Updated allowed origins.
* Restarted FastAPI.

---

### Error 2 – Network Error

Cause:

* Incorrect frontend environment configuration.

Solution:

* Fixed `.env` configuration.
* Verified backend endpoint.
* Restarted Vite.

---

### Error 3 – Upload Failed

Investigation:

* Used Console logs.
* Inspected Network tab.
* Verified backend responses.
* Checked request URLs.

Successfully resolved all frontend-backend communication issues.

---

## Concepts Learned

* Browser Streams
* StreamingResponse
* Fetch API
* TextDecoder
* Readable Streams
* CORS
* Middleware
* Cross-Origin Communication

---

## Outcome

Successfully connected React with FastAPI and Gemini for AI analysis while learning how streaming responses work internally and resolving frontend-backend communication issues.

---

# Day 11 – ATS Results Dashboard

## Goal

Convert structured Gemini JSON responses into a professional ATS dashboard.

---

## Tasks Completed

### Results Dashboard

* Created `ResultsDashboard.jsx`.
* Built a clean dashboard for displaying AI-generated ATS analysis.

### Animated ATS Score Ring

Implemented an SVG-based circular progress indicator.

Features:

* Dynamic circumference calculation.
* Stroke dash offset.
* Animated score transition.
* Dynamic color coding:

  * Green (High Score)
  * Orange (Medium Score)
  * Red (Low Score)

### Experience Level

* Displayed AI-generated experience level using badges.

### Resume Summary

* Displayed AI-generated professional summary.

### Skills Found

* Rendered detected skills as green badges.

### Missing Skills

* Displayed missing skills as red badges.

### Improvement Suggestions

* Displayed AI recommendations in a numbered list.

---

## Concepts Learned

* SVG Graphics
* Circular Progress Rings
* Stroke Dash Array
* Stroke Dash Offset
* Conditional Rendering
* React Props
* Array Mapping
* Dynamic Styling
* Component Composition

---

## Outcome

Successfully transformed raw AI-generated JSON into a visually appealing ATS dashboard, significantly improving user experience.

---





