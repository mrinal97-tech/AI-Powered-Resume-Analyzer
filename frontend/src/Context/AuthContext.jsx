import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const login = (accessToken, email) => {
    setToken(accessToken);
    setUserEmail(email);
  };

  const logout = () => {
    setToken(null);
    setUserEmail("");
  };

  return (
    <AuthContext.Provider
      value={{ token, userEmail, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}