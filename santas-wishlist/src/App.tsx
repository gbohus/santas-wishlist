import { useState } from "react"
import LoginPage from "./pages/auth/login"
import DashboardPage from "./pages/dashboard"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />
  }

  return <DashboardPage />
}

export default App
