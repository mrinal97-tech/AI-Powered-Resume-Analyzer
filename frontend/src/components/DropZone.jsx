import { useDropzone } from "react-dropzone";
import { useState } from "react";
import axios from "axios";

export default function DropZone({onExtracted}){
    const[status , setStatus] = useState('idle')
    const[error , setError] = useState(null)


const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

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
      setError(err.response?.data?.detail || 'Upload failed')
      setStatus('error')
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
      className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
        transition-colors ${isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'}`}
    >
      <input {...getInputProps()} />
      {status === 'uploading' && <p className="text-blue-600">Extracting text...</p>}
      {status === 'done' && <p className="text-green-600">Resume loaded!</p>}
      {status === 'error' && <p className="text-red-600">{error}</p>}
      {status === 'idle' && (
        <p className="text-gray-500">
          {isDragActive ? 'Drop it here' : 'Drag a PDF or DOCX, or click to browse'}
        </p>
      )}
    </div>
  )
}
