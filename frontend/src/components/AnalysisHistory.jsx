import { useEffect, useState } from "react"
import { useAuth } from "../Context/AuthContext"

export default function AnalysisHistory({ refreshKey = 0 }) {
  const { token } = useAuth()

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setHistory([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError("")

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/history`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.detail || "Failed to load analysis history"
          )
        }

        /*
         * Supports both possible backend responses:
         *
         * 1. Direct array:
         *    [{...}, {...}]
         *
         * 2. Object containing history:
         *    { history: [{...}, {...}] }
         */
        if (Array.isArray(data)) {
          setHistory(data)
        } else if (Array.isArray(data.history)) {
          setHistory(data.history)
        } else {
          setHistory([])
        }
      } catch (err) {
        console.error("History error:", err)

        setError(
          err.message || "Unable to load analysis history"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [token, refreshKey])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />

        <p className="ml-3 text-sm text-gray-500">
          Loading history...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-700">
          Could not load history
        </p>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 px-6 py-10 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 12h6M9 16h6M9 8h2" />
            <path d="M6 3h9l3 3v15H6z" />
          </svg>
        </div>

        <p className="mt-3 text-sm font-medium text-gray-700">
          No saved analyses yet
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Your completed resume analyses will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {history.map((item, index) => {
        const filename =
          item.filename ||
          item.file_name ||
          "Untitled resume"

        const atsScore =
          item.ats_score ??
          item.analysis_result?.ats_score ??
          item.result?.ats_score ??
          null

        const experienceLevel =
          item.experience_level ||
          item.analysis_result?.experience_level ||
          item.result?.experience_level ||
          ""

        const createdAt =
          item.created_at ||
          item.createdAt ||
          item.date ||
          null

        return (
          <article
            key={item.id ?? `${filename}-${index}`}
            className="rounded-xl border border-gray-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {filename}
                </p>

                {experienceLevel && (
                  <p className="mt-1 text-xs text-gray-500">
                    Experience level: {experienceLevel}
                  </p>
                )}

                {createdAt && (
                  <p className="mt-1 text-xs text-gray-400">
                    {formatDate(createdAt)}
                  </p>
                )}
              </div>

              {atsScore !== null && (
                <div className="shrink-0 rounded-xl bg-indigo-50 px-3 py-2 text-center">
                  <p className="text-lg font-semibold text-indigo-700">
                    {atsScore}
                  </p>

                  <p className="text-[10px] font-medium uppercase tracking-wide text-indigo-500">
                    ATS score
                  </p>
                </div>
              )}
            </div>

            {item.summary && (
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                {item.summary}
              </p>
            )}
          </article>
        )
      })}
    </div>
  )
}

function formatDate(dateValue) {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return String(dateValue)
  }

  return date.toLocaleString()
}