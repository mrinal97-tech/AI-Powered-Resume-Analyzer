import { useDropzone } from "react-dropzone";
import { useState } from "react";
import axios from "axios";

export default function DropZone({ onExtracted }) {
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState(null)

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setFileName(file.name)
    setStatus('uploading')
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/extract`,
        formData
      )
      onExtracted(res.data.text)
      setStatus('done')
    } catch (err) {
      console.error("FULL ERROR:", err)
      console.error("RESPONSE:", err.response)
      console.error("DATA:", err.response?.data)

      setError(
        JSON.stringify(err.response?.data) ||
        err.message ||
        "Upload failed"
      )
      setStatus("error")
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  })

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl px-6 py-10 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}
        ${status === 'error' ? 'border-red-300 bg-red-50' : ''}
        ${status === 'done' ? 'border-emerald-300 bg-emerald-50' : ''}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-2">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center
          ${status === 'error' ? 'bg-red-100 text-red-500'
            : status === 'done' ? 'bg-emerald-100 text-emerald-600'
            : 'bg-indigo-50 text-indigo-500'}`}>
          {status === 'uploading' ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : status === 'done' ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : status === 'error' ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A2 2 0 004.18 21h15.64a2 2 0 001.87-2.96L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 16V4m0 0L7 9m5-5l5 5M4 20h16" />
            </svg>
          )}
        </div>

        {status === 'uploading' && <p className="text-sm font-medium text-indigo-600">Extracting text from {fileName}…</p>}
        {status === 'done' && <p className="text-sm font-medium text-emerald-700">{fileName} loaded successfully</p>}
        {status === 'error' && <p className="text-sm font-medium text-red-600 max-w-xs break-words mx-auto">{error}</p>}
        {status === 'idle' && (
          <>
            <p className="text-sm font-medium text-gray-700">
              {isDragActive ? 'Drop it here' : 'Drag & drop your resume, or click to browse'}
            </p>
            <p className="text-xs text-gray-400">PDF or DOCX · max 1 file</p>
          </>
        )}
      </div>
    </div>
  )
}