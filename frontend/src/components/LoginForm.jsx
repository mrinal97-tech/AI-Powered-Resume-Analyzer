import { useState } from "react"
import { useAuth } from "../Context/AuthContext"

export default function LoginForm({
  onSwitchToRegister,
}) {
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed"
        )
      }

      if (!data.access_token) {
        throw new Error(
          "Login succeeded, but no access token was returned"
        )
      }

      login(data.access_token, email)
    } catch (error) {
      console.error("Login error:", error)

      setError(
        error.message ||
          "Unable to log in. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="space-y-5"
    >
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome back
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Log in to analyze your resume and view
          your saved results.
        </p>
      </div>

      <div>
        <label
          htmlFor="login-email"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Email address
        </label>

        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
          placeholder="mrinal@example.com"
          className="w-full rounded-xl border border-gray-200 px-4 py-3
                     text-sm text-gray-900 outline-none transition
                     placeholder:text-gray-400
                     focus:border-indigo-500 focus:ring-2
                     focus:ring-indigo-100"
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <input
          id="login-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Enter your password"
          className="w-full rounded-xl border border-gray-200 px-4 py-3
                     text-sm text-gray-900 outline-none transition
                     placeholder:text-gray-400
                     focus:border-indigo-500 focus:ring-2
                     focus:ring-indigo-100"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50
                     px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={
          loading || !email.trim() || !password
        }
        className="w-full rounded-xl bg-indigo-600 px-5 py-3
                   text-sm font-medium text-white transition
                   hover:bg-indigo-700 active:bg-indigo-800
                   disabled:cursor-not-allowed
                   disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?
        </p>

        <button
          type="button"
          onClick={onSwitchToRegister}
          className="mt-1 text-sm font-medium text-indigo-600
                     hover:text-indigo-700"
        >
          Create a new account
        </button>
      </div>
    </form>
  )
}