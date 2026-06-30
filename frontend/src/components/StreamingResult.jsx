import { useState } from "react";

export default function StreamingResult({ resumeText, jobDescription, onAnalysisComplete}){
    const[loading , setLoading] = useState(false)

    const runAnalysis = async() =>{
        setLoading(true)
    
    try{
      const response   = await fetch(
         `${import.meta.env.VITE_API_URL}/analyze`,
         {
          method:'POST',
          headers: {
          "Content-Type": "application/json",
         },
         body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription || null,
         }),
    }
  )
      const data = await response.json()

      onAnalysisComplete(data)

  }   catch (err) {
      console.error(err)
  }
      
    
      try{
        const data = await response.json()
         
        console.log("Analysis Result :",data)

        onAnalysisComplete(data)
      }catch(err){
        console.log("Analysis Error:",err)
      }finally{
        setLoading(false)
      }
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

      
    </div>
  )
}
