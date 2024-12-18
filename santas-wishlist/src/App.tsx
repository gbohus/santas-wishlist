import { useEffect, useState } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import LoginPage from "./pages/auth/login"
import DashboardPage from "./pages/dashboard"

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🎅</div>
      </div>
    )
  }

  if (!session) {
    return <LoginPage onLogin={() => {}} /> // onLogin prop is handled by Supabase now
  }

  return <DashboardPage />
}

export default App
