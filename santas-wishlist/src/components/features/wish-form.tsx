import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { WishCategory } from "@/types"

interface WishFormProps {
  onSubmit: (wish: { title: string; description: string; category: WishCategory }) => void
}

const categories: { value: WishCategory; label: string; icon: string }[] = [
  { value: 'toys', label: 'Toys', icon: '🧸' },
  { value: 'books', label: 'Books', icon: '📚' },
  { value: 'electronics', label: 'Electronics', icon: '🎮' },
  { value: 'clothes', label: 'Clothes', icon: '👕' },
  { value: 'other', label: 'Other', icon: '🎈' },
]

export function WishForm({ onSubmit }: WishFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<WishCategory>('toys')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, description, category })
    setTitle("")
    setDescription("")
    setCategory('toys')
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-christmas-red">Write Your Wish to Santa! 🎄</h2>
        <p className="text-christmas-green">Tell Santa what you'd like for Christmas!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-christmas-green" htmlFor="wish-title">
            What would you like? 🎁
          </label>
          <Input
            id="wish-title"
            placeholder="e.g., A new bicycle, A teddy bear"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="border-christmas-gold focus-visible:ring-christmas-green"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-christmas-green" htmlFor="wish-category">
            Category 🎯
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                type="button"
                variant={category === cat.value ? "christmas" : "outline"}
                onClick={() => setCategory(cat.value)}
                className="flex items-center space-x-1"
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-christmas-green" htmlFor="wish-description">
            Tell Santa more about it! ✨
          </label>
          <textarea
            id="wish-description"
            placeholder="Describe your wish in detail... Santa loves details!"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-[100px] w-full rounded-md border border-christmas-gold bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-christmas-green focus-visible:ring-offset-2"
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            variant="christmas"
            className="w-full text-lg font-bold"
          >
            Send to Santa! 🎅
          </Button>
        </div>
      </form>

      <div className="text-center text-sm text-christmas-green">
        <p>Remember to be nice, not naughty! Santa is watching! 👀</p>
      </div>
    </div>
  )
} 