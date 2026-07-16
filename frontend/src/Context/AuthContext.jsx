import {
  createContext,
  useContext,
  useState
} from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [userEmail, setUserEmail] = useState(null)

  const login = (accessToken, email) => {
    setToken(accessToken)
    setUserEmail(email)
  }

  const logout = () => {
    setToken(null)
    setUserEmail(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        userEmail,
        login,
        logout,
        isAuthenticated: Boolean(token)
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    )
  }

  return context
}