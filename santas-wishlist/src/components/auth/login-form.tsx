import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { signInWithEmail, signUpWithEmail } from "@/lib/supabase"

interface LoginFormProps {
  onLogin: () => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastAttempt, setLastAttempt] = useState(0)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Check if enough time has passed since last attempt
    const now = Date.now()
    const timeSinceLastAttempt = now - lastAttempt
    if (timeSinceLastAttempt < 7000) {
      const timeLeft = Math.ceil((7000 - timeSinceLastAttempt) / 1000)
      setError(`Please wait ${timeLeft} seconds before trying again... Santa's elves are busy! 🎅`)
      return
    }

    try {
      setIsLoading(true)
      setLastAttempt(now)
      
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password, username)
        if (error) throw error
        setError("🎄 Check your email to confirm your account! 📧\n\nSanta's elves have sent you a special message. Click the magic link to activate your account! ✨")
      } else {
        const { error } = await signInWithEmail(email, password)
        if (error) throw error
        onLogin()
      }
    } catch (error: any) {
      let message = error.message || "Something went wrong! Santa's elves are looking into it! 🎅"
      
      // Make error messages more user-friendly
      if (message.includes('rate limit')) {
        message = "Ho ho hold on! Please wait a moment before trying again... Santa's elves are busy! 🎅"
      } else if (message.includes('Invalid login')) {
        message = "Oops! Your email or password seems incorrect. Santa's checking his list twice! 🎅"
      } else if (message.includes('Email not confirmed')) {
        message = "Please check your email and confirm your account first! ✉️"
      }
      
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [email, password, username, isSignUp, onLogin, lastAttempt])

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl border-4 border-christmas-gold">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-christmas-red">Welcome to Santa's Workshop!</h1>
        <p className="text-christmas-green">
          {isSignUp ? "Create your magical account!" : "Ho Ho Ho! Please log in to see your wishlist!"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-christmas-green" htmlFor="email">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {isSignUp && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-christmas-green" htmlFor="username">
              Your Elf Name
            </label>
            <Input
              id="username"
              placeholder="Choose your magical elf name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-christmas-green" htmlFor="password">
            Secret Santa Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Your special holiday password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className={`
            p-4 rounded-lg border-2 text-center whitespace-pre-line
            ${error.includes('Check your email') 
              ? 'text-christmas-green border-christmas-green/30 bg-christmas-green/10 text-base font-medium' 
              : 'text-red-500 border-red-200 bg-red-50 text-sm'
            }`}
          >
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          variant="christmas" 
          className="w-full text-lg font-bold"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span>Checking Santa's List...</span>
            </div>
          ) : (
            isSignUp ? "Join Santa's Workshop! 🎄" : "Enter Santa's Workshop! 🎄"
          )}
        </Button>
      </form>

      <div className="text-center space-y-4">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError("") // Clear any existing errors when switching modes
          }}
          className="text-christmas-green hover:text-christmas-red text-sm"
        >
          {isSignUp 
            ? "Already have an account? Sign in!" 
            : "Need an account? Join Santa's Workshop!"}
        </button>
        <div className="text-sm">
          <a href="#" className="text-christmas-green hover:text-christmas-red">
            Need help? Ask an elf!
          </a>
        </div>
      </div>
    </div>
  )
} 