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
