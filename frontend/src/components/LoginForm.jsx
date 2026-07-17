import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function LoginForm({
  onSwitchToRegister
}) {
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || "Login failed"
        )
      }

      login(data.access_token, email)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">
        Welcome back
      </h2>

      <input
        type="email"
        required
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        placeholder="Email"
        className="w-full border rounded-lg p-3"
      />

      <input
        type="password"
        required
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        placeholder="Password"
        className="w-full border rounded-lg p-3"
      />

      <button
        disabled={loading}
        className="w-full bg-purple-600 text-white
                   rounded-lg py-3 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onSwitchToRegister}
        className="text-purple-600 text-sm"
      >
        Create a new account
      </button>
    </form>
  )
}