import { useState } from "react";
import { useAuth } from "../context/AuthContext"

export default function StreamingResult({
  resumeText,
  jobDescription,
  onAnalysisComplete,
  onAnalysisStart,
  onAnalysisError,
}) {
   const { token } = useAuth()

  const [loading, setLoading] = useState(false)

  const runAnalysis = async () => {
   
    setLoading(true)
    onAnalysisStart?.()

    try {
      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/analyze`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription || null,
      filename: filename || null
    })
  }
)

      if (!response.ok) {
        const errBody = await response.text()
        throw new Error(errBody || `Request failed with status ${response.status}`)
      }

      const data = await response.json()
      console.log("Analysis Result:", data)
      onAnalysisComplete(data)
    } catch (err) {
      console.error("Analysis Error:", err)
      onAnalysisError?.(err.message || "Failed to analyze resume")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={runAnalysis}
      disabled={loading || !resumeText}
      className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white
                 text-sm font-medium px-5 py-3 rounded-xl shadow-sm
                 hover:bg-indigo-700 active:bg-indigo-800
                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {loading ? 'Analyzing…' : 'Analyze Resume'}
    </button>
  )
}