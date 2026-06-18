# CHANGELOG

## v0.1.0 — Initial FastAPI Setup

### Added

* FastAPI application
* Uvicorn server
* Health endpoint

### Commands

```bash
git add .
git commit -m "Initial FastAPI setup"
git push origin main
```

---

## v0.2.0 — Resume Upload Endpoint

### Added

* Resume upload endpoint
* File type validation
* File size validation

### Commands

```bash
git add main.py
git commit -m "Add resume upload endpoint"
git push origin main
```

---

## v0.3.0 — Resume Text Extraction

### Added

* PDF extraction
* DOCX extraction
* Extraction service layer

### Files

```text
services/extractor.py
```

### Commands

```bash
git add services/extractor.py main.py
git commit -m "Add PDF and DOCX extraction"
git push origin main
```

---

## v0.4.0 — Pydantic Models

### Added

* AnalysisRequest
* AnalysisResponse
* ExtractionResponse
* ErrorResponse

### Files

```text
models.py
```

### Commands

```bash
git add models.py
git commit -m "Add Pydantic models"
git push origin main
```

---

## v0.5.0 — LLM Integration

### Added

* LLM service
* Prompt engineering
* JSON output parsing

### Files

```text
services/llm.py
```

### Commands

```bash
git add services/llm.py
git commit -m "Add LLM integration service"
git push origin main
```

---

## v0.5.1 — Secret Management Fix

### Fixed

* Removed committed API key
* Added .gitignore
* Removed .env from Git tracking

### Commands

```bash
git rm --cached .env
git add .gitignore
git commit -m "Remove secrets and update gitignore"
git push origin main
```

---

## v0.6.0 — Gemini Migration

### Changed

* Replaced Claude API
* Added Gemini integration
* Updated environment variables

### Commands

```bash
git add services/llm.py
git commit -m "Migrate from Claude to Gemini"
git push origin main
```

---

## v0.6.1 — JSON Output Stabilization

### Fixed

* Invalid JSON responses
* Markdown cleanup
* Response parsing issues

### Commands

```bash
git add services/llm.py main.py
git commit -m "Improve JSON parsing and validation"
git push origin main
```

---

## v0.6.2 — Resume Validation Improvements

### Added

* Short resume detection
* Hallucination reduction
* Better ATS scoring prompt

### Commands

```bash
git add services/llm.py
git commit -m "Improve ATS analysis prompt and validation"
git push origin main
```

---

## Current Version

```text
v0.6.2
```

### Features

✓ Health Endpoint

✓ Resume Upload

✓ PDF Extraction

✓ DOCX Extraction

✓ Pydantic Models

✓ Gemini Integration

✓ ATS Analysis

✓ JSON Validation

✓ Error Handling

✓ GitHub Integration

✓ Secret Protection

✓ Prompt Engineering
