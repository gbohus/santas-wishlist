import { LoginForm } from "@/components/auth/login-form"

interface LoginPageProps {
  onLogin: () => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-christmas-red to-christmas-green p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/snowflakes.svg')] opacity-20 animate-snow bg-repeat"></div>
      </div>
      <LoginForm onLogin={onLogin} />
    </div>
  )
} 