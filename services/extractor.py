import pdfplumber
import docx
import io

def extract_text_from_pdf(file_bytes:bytes) -> str:
    """Extract text from PDF bytes. Returns empty string if extraction fails."""
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            pages = []
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pages.append(text) 
            return "\n\n".join(pages)
    except Exception as e:
        raise ValueError(f"PDF extraction failed: {str(e)}")
def extract_text_from_docx(file_bytes:bytes) -> str:
    """Extract text from DOCX bytes."""
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
        return "\n".join(paragraphs)
    except Exception as e:
        raise ValueError(f"DOCX extraction failed: {str(e)}")
def extract_resume_text(file_bytes: bytes, content_type: str) -> str:
    """Route to correct extractor based on file type."""
    if content_type == "application/pdf":
        text = extract_text_from_pdf(file_bytes)
    else:
        text = extract_text_from_docx(file_bytes)

    if not text.strip():
        raise ValueError(
            "No text found. File may be a scanned image — "
            "please use a text-based PDF."
        )
    return text 