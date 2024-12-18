import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Edit2, Trash2, Check, X, Clock } from "lucide-react"
import type { Wish } from "@/lib/api"

interface WishListProps {
  wishes: Wish[]
  onDelete: (id: string) => Promise<void>
  onUpdate: (id: string, updates: Partial<Wish>) => Promise<void>
  isLoading?: boolean
  variant?: 'default' | 'card'
}

export function WishList({ wishes, onDelete, onUpdate, isLoading, variant = 'default' }: WishListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: "", description: "" })
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const getStatusIcon = (status: Wish['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'approved':
        return <Check className="h-4 w-4" />
      case 'delivered':
        return '🎁'
      default:
        return null
    }
  }

  const getStatusColor = (status: Wish['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'approved':
        return 'text-christmas-green bg-christmas-green/10'
      case 'delivered':
        return 'text-christmas-red bg-christmas-red/10'
      default:
        return 'text-gray-500 bg-gray-50'
    }
  }

  const handleEdit = (wish: Wish) => {
    setEditingId(wish.id)
    setEditForm({ title: wish.title, description: wish.description })
  }

  const handleUpdate = async (id: string) => {
    try {
      setLoadingId(id)
      await onUpdate(id, editForm)
      setEditingId(null)
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this wish?')) {
      try {
        setLoadingId(id)
        await onDelete(id)
      } finally {
        setLoadingId(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (wishes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold text-christmas-red mb-2">Your Wishlist is Empty!</h3>
        <p className="text-christmas-green">Time to write your wishes to Santa! 🎅</p>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishes.map((wish) => (
          <Card key={wish.id} className="group relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {editingId === wish.id ? (
              <div className="p-4 space-y-4">
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Wish title"
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Wish description"
                  className="min-h-[100px] w-full rounded-md border border-christmas-gold bg-background px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    variant="christmas"
                    onClick={() => handleUpdate(wish.id)}
                    disabled={loadingId === wish.id}
                    size="sm"
                  >
                    {loadingId === wish.id ? <Spinner size="sm" /> : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingId(null)}
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-3">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
                    getStatusColor(wish.status)
                  )}>
                    {getStatusIcon(wish.status)}
                    <span>{wish.status.charAt(0).toUpperCase() + wish.status.slice(1)}</span>
                  </span>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEdit(wish)}
                    >
                      <Edit2 className="h-4 w-4 text-christmas-green" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDelete(wish.id)}
                    >
                      <Trash2 className="h-4 w-4 text-christmas-red" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-christmas-red">
                    {wish.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {wish.description}
                  </p>
                </div>

                {/* Date */}
                <div className="mt-4 text-xs text-gray-500">
                  Added {new Date(wish.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    )
  }

  // Default list variant
  return (
    <div className="space-y-4">
      {wishes.map((wish) => (
        <div
          key={wish.id}
          className="rounded-lg border-2 border-christmas-gold p-4 transition-shadow hover:shadow-lg"
        >
          {editingId === wish.id ? (
            <div className="space-y-4">
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Wish title"
              />
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Wish description"
                className="min-h-[100px] w-full rounded-md border border-christmas-gold bg-background px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant="christmas"
                  onClick={() => handleUpdate(wish.id)}
                  disabled={loadingId === wish.id}
                >
                  {loadingId === wish.id ? <Spinner size="sm" /> : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-christmas-red">{wish.title}</h3>
                <span className="text-xl" title={wish.status}>
                  {getStatusIcon(wish.status)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{wish.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className={cn("text-sm", getStatusColor(wish.status))}>
                  Status: {wish.status.charAt(0).toUpperCase() + wish.status.slice(1)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(wish)}
                    className="text-christmas-green hover:text-christmas-red"
                    disabled={loadingId === wish.id}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(wish.id)}
                    className="text-christmas-red hover:text-christmas-red/80"
                    disabled={loadingId === wish.id}
                  >
                    {loadingId === wish.id ? <Spinner size="sm" /> : 'Delete'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
} 