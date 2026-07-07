# AI-Powered Resume Analyzer

An end-to-end AI-powered Resume Analyzer that evaluates resumes against job descriptions using Large Language Models (LLMs), providing ATS compatibility scores, missing skills analysis, improvement suggestions, and actionable feedback.

Designed with a scalable architecture using **FastAPI**, **React**, **Google Gemini**, **PostgreSQL**, and **Docker**, making it production-ready and extensible for future RAG-based resume intelligence.

---

##  Overview

Recruiters receive hundreds of resumes for every job posting. Manually evaluating each resume is time-consuming and inconsistent.

This project automates resume screening by combining:

- Resume parsing
- ATS score evaluation
- Skill extraction
- Job description comparison
- AI-generated improvement suggestions
- Structured JSON outputs using LLMs

The system helps candidates optimize resumes before applying while reducing manual effort for recruiters.

---

# ✨ Features

## Resume Upload

Supports:

- PDF
- DOCX

Extracts resume text while preserving formatting as much as possible.

---

## ATS Compatibility Analysis

Calculates:

- ATS Score
- Resume Quality Score
- Overall Match Score

based on:

- Technical skills
- Experience
- Education
- Keywords
- Job relevance

---

## AI Skill Extraction

Automatically identifies

- Programming Languages
- Frameworks
- Databases
- Cloud Technologies
- AI/ML Skills
- Soft Skills
- Tools

using Gemini LLM.

---

## Missing Skills Detection

Compares resume against a Job Description.

Outputs:

- Missing technologies
- Missing frameworks
- Missing tools
- Missing keywords

Example

Job requires

Python
Docker
AWS
FastAPI
Redis

Resume contains

Python
FastAPI

Output

Missing

Docker
AWS
Redis

---

## AI Suggestions

Generates intelligent recommendations such as

- Add measurable achievements
- Improve project descriptions
- Include missing technologies
- Optimize ATS keywords
- Strengthen professional summary

---

## Experience Level Detection

Automatically predicts

- Fresher
- Junior
- Mid-level
- Senior

based on resume content.

---

## JSON Schema Validation

LLM responses are validated using structured schemas.

Benefits

- Reliable parsing
- No malformed AI outputs
- Consistent frontend rendering

---

# 🏗 System Architecture

Frontend (React + Tailwind)

↓

FastAPI REST APIs

↓

Resume Parser

↓

Text Extraction Service

↓

Google Gemini API

↓

Structured JSON Validation

↓

Response Formatter

↓

React Dashboard

---

# Tech Stack

## Frontend

- React
- Vite
- TailwindCSS
- Axios
- React Dropzone

---

## Backend

- FastAPI
- Pydantic
- Uvicorn
- Python

---

## AI

- Google Gemini API
- Prompt Engineering
- Structured JSON Generation

---

## Resume Processing

- pdfplumber
- python-docx

---

## Database

- PostgreSQL
- Supabase

---

## DevOps

- Docker
- GitHub
- REST APIs

---

# API Endpoints

## Health Check

GET

```
/health
```

Returns

```
{
   "status":"ok"
}
```

---

## Upload Resume

POST

```
/upload
```

Input

Resume File

Output

Extracted text

---

## Analyze Resume

POST

```
/analyze
```

Input

```
{
  "resume_text":"",
  "job_description":""
}
```

Output

```
{
  "ats_score":88,
  "skills_found":[],
  "missing_skills":[],
  "suggestions":[],
  "experience_level":"Junior",
  "summary":"..."
}
```

---

# Folder Structure

```
backend/

    services/
        extractor.py
        llm.py
        auth.py

    models/

    schemas/

    main.py

frontend/

    components/

    pages/

    hooks/

    services/

Dockerfile

README.md
```

---

# Future Improvements

- Resume Ranking
- Multiple Resume Comparison
- Resume Version History
- Vector Database
- RAG Pipeline
- Recruiter Dashboard
- Authentication
- Interview Readiness Score
- Resume Embeddings
- AI Career Coach

---

# Learning Outcomes

- FastAPI Architecture
- REST API Design
- LLM Integration
- Prompt Engineering
- JSON Validation
- Resume Parsing
- React + FastAPI Integration
- Dockerization
- Production-ready Backend Design

---

# Author

**Mrinal Kadam**

AI Engineer | Software Engineer

