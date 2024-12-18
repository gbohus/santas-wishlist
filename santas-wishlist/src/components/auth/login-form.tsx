import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { api } from "@/lib/api"

interface LoginFormProps {
  onLogin: () => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      setIsLoading(true)
      await api.login(username, password)
      onLogin()
    } catch (error) {
      setError("Invalid elf name or password! Santa's checking his list twice! 🎅")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl border-4 border-christmas-gold">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-christmas-red">Welcome to Santa's Workshop!</h1>
        <p className="text-christmas-green">Ho Ho Ho! Please log in to see your wishlist!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-christmas-green" htmlFor="username">
            Your Elf Name
          </label>
          <Input
            id="username"
            placeholder="Enter your magical elf name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

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
          <div className="text-sm text-red-500 text-center">
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
            "Enter Santa's Workshop! 🎄"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <a href="#" className="text-christmas-green hover:text-christmas-red">
          Need help? Ask an elf!
        </a>
      </div>
    </div>
  )
} 