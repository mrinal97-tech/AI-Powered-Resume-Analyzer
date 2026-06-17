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
