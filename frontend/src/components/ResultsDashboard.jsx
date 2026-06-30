function ScoreRing({ score }) {
  const r = 54
  const circumference = 2 * Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="70" y="70" textAnchor="middle" dominantBaseline="central" fontSize="28" fontWeight="bold" fill={color}>
          {score}
        </text>
        <text x="70" y="92" textAnchor="middle" fontSize="11" fill="#9ca3af">
          ATS Score
        </text>
      </svg>
    </div>
  )
}

export default function ResultsDashboard({ data }) {
  if (!data || !data.skills_found) return null

  const skillsFound = data.skills_found || []
  const missingSkills = data.missing_skills || []
  const suggestions = data.improvement_suggestions || []
  const score = data.ats_score || 0

  return (
    <div className="mt-6 space-y-6">
      <div className="flex gap-8 items-start">
        <ScoreRing score={score} />

        <div>
          <p className="text-sm text-gray-500 mb-1">Experience level</p>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium capitalize">
            {data.experience_level || 'unknown'}
          </span>
          <p className="mt-3 text-gray-700 text-sm">{data.summary}</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Skills found</h3>
        <div className="flex flex-wrap gap-2">
          {skillsFound.map((s) => (
            <span key={s} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
              {s}
            </span>
          ))}
        </div>
      </div>

      {missingSkills.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Missing skills</h3>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((s) => (
              <span key={s} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-2">Improvement suggestions</h3>
        <ol className="space-y-2">
          {suggestions.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-blue-600 font-bold shrink-0">{i + 1}.</span>
              <span className="text-gray-700">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}