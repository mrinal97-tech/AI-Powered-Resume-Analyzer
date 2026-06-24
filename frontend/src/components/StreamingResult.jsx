import { useState } from "react";

export default function StreamingResult({ resumeText, jobDescription }){
    const[output , setOutput] = useState('')
    const[loading , setLoading] = useState(false)

    const runAnalysis = async() =>{
        setOutput('')
        setLoading(true)
    
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/analyze/stream`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription || null
        })
      }
    )
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      setOutput(prev => prev + decoder.decode(value))
    }
    setLoading(false)
  }
  return (
    <div className="mt-6">
      <button
        onClick={runAnalysis}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg
                   hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {output && (
        <pre className="mt-4 bg-gray-900 text-green-400 p-4
                        rounded-lg text-sm overflow-auto">
          {output}
        </pre>
      )}
    </div>
  )
}
