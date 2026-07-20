import { useState } from "react"
import DropZone from './components/DropZone'
import StreamingResult from './components/StreamingResult'
import ResultsDashboard from "./components/ResultsDashboard"
import { Card, CardHeader, EmptyState, Spinner } from "./components/ui"

function App() {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysisData, setAnalysisData] = useState(null)
  const [filename, setFilename] = useState("")
  const [analysisStatus, setAnalysisStatus] = useState('idle') // idle | loading | error | done
  const [analysisError, setAnalysisError] = useState(null)

  const handleAnalysisComplete = (data) => {
    setAnalysisData(data)
    setAnalysisStatus('done')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="h-4.5 w-4.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4M7.8 4h8.4a2.8 2.8 0 012.8 2.8v10.4a2.8 2.8 0 01-2.8 2.8H7.8A2.8 2.8 0 015 17.2V6.8A2.8 2.8 0 017.8 4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-none">ResumeIQ</p>
              <p className="text-xs text-gray-400 leading-none mt-0.5">AI Resume Analyzer</p>
            </div>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">Beta · Powered by Gemini</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Analyze your resume</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload a resume, optionally paste a job description, and get an instant ATS-readiness breakdown.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left column: inputs */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader eyebrow="Step 1" title="Upload resume" description="PDF or DOCX, up to one file." />
              <div className="p-6 pt-4">
                <DropZone onExtracted={setResumeText} 
                onFilenameReceived={setFilename}/>
              </div>
            </Card>

            {resumeText && (
              <Card>
                <CardHeader eyebrow="Step 2" title="Job description" description="Optional — improves match accuracy." />
                <div className="p-6 pt-4 space-y-4">
                  <textarea
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm text-gray-700
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                               resize-none placeholder:text-gray-400"
                    rows={6}
                    placeholder="Paste a job description here (optional)..."
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                  />
                  <StreamingResult
                    resumeText={resumeText}
                    jobDescription={jobDescription}
                    filename={filename}
                    onAnalysisStart={() => { setAnalysisStatus('loading'); setAnalysisError(null) }}
                    onAnalysisComplete={handleAnalysisComplete}
                    onAnalysisError={(msg) => { setAnalysisStatus('error'); setAnalysisError(msg) }}
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Right column: results */}
          <div className="lg:col-span-7">
            <Card className="min-h-[420px]">
              {analysisStatus === 'idle' && (
                <EmptyState
                  icon={
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 17V7m6 10V7M4 21h16M4 3h16" />
                    </svg>
                  }
                  title="No analysis yet"
                  description="Upload a resume and click Analyze to see your ATS score, skill matches, and suggestions here."
                />
              )}

              {analysisStatus === 'loading' && (
                <div className="flex flex-col items-center justify-center py-20 text-indigo-600">
                  <Spinner className="h-8 w-8 mb-3" />
                  <p className="text-sm font-medium text-gray-700">Analyzing your resume…</p>
                  <p className="text-xs text-gray-400 mt-1">This usually takes a few seconds</p>
                </div>
              )}

              {analysisStatus === 'error' && (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <div className="h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A2 2 0 004.18 21h15.64a2 2 0 001.87-2.96L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Analysis failed</p>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm">
                    {analysisError || 'Something went wrong. Please try again.'}
                  </p>
                </div>
              )}

              {analysisStatus === 'done' && analysisData && (
                <div className="p-6">
                  <ResultsDashboard data={analysisData} />
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App