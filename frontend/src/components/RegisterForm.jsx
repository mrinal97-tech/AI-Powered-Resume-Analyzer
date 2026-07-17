import { useState } from "react";

export default function RegisterForm({
  onSwitchToLogin
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/register`,
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
          data.detail || "Registration failed"
        )
      }

      setMessage("Account created. Please log in.")
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleRegister}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold">
        Create account
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
        minLength={8}
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
        {loading ? "Creating account..." : "Register"}
      </button>

      {message && (
        <p className="text-sm">{message}</p>
      )}

      <button
        type="button"
        onClick={onSwitchToLogin}
        className="text-purple-600 text-sm"
      >
        Already registered? Log in
      </button>
    </form>
  )
}