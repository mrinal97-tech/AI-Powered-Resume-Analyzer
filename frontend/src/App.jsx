import { useState } from "react"
import DropZone from './components/DropZone'
import StreamingResult from './components/StreamingResult'
import ResultsDashboard from "./components/ResultsDashboard"

function App() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysisData, setAnalysisData] = useState(null)

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">AI Resume Analyzer</h1>
      <DropZone onExtracted={setResumeText} />

      {resumeText && (
        <>
          <textarea
            className="w-full mt-4 p-3 border rounded-lg text-sm"
            rows={6}
            placeholder="Paste a job description here (optional)..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
          />
          <StreamingResult
        resumeText={resumeText}
        jobDescription={jobDescription}
        onAnalysisComplete={setAnalysisData}
      />

      <ResultsDashboard data={analysisData} />
        </>
      )}
    </div>
  )
}

export default App