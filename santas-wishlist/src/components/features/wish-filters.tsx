import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import type { WishCategory, WishStatus } from "@/types"

interface WishFiltersProps {
  selectedCategory: WishCategory | 'all'
  selectedStatus: WishStatus | 'all'
  onCategoryChange: (category: WishCategory | 'all') => void
  onStatusChange: (status: WishStatus | 'all') => void
  variant?: 'default' | 'compact'
}

const categories: { value: WishCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All Wishes', icon: '🎁' },
  { value: 'toys', label: 'Toys', icon: '🧸' },
  { value: 'books', label: 'Books', icon: '📚' },
  { value: 'electronics', label: 'Electronics', icon: '🎮' },
  { value: 'clothes', label: 'Clothes', icon: '👕' },
  { value: 'other', label: 'Other', icon: '🎈' },
]

const statuses: { value: WishStatus | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All Status', icon: '📋' },
  { value: 'pending', label: 'Pending', icon: '⏳' },
  { value: 'approved', label: 'Approved', icon: '✨' },
  { value: 'delivered', label: 'Delivered', icon: '🎁' },
]

export function WishFilters({
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
  variant = 'default'
}: WishFiltersProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "christmas" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.value)}
              className="h-8 px-3"
            >
              <span className="mr-1">{category.icon}</span>
              <span className="text-sm">{category.label}</span>
            </Button>
          ))}
        </div>

        {/* Status Filter Button */}
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 flex items-center gap-2"
          onClick={() => {
            const currentIndex = statuses.findIndex(s => s.value === selectedStatus)
            const nextIndex = (currentIndex + 1) % statuses.length
            onStatusChange(statuses[nextIndex].value)
          }}
        >
          <Filter className="h-4 w-4" />
          <span>{statuses.find(s => s.value === selectedStatus)?.icon}</span>
          <span className="text-sm">{statuses.find(s => s.value === selectedStatus)?.label}</span>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight text-christmas-red">
            My Wishes
          </h2>
          <p className="text-sm text-christmas-green">
            Filter your wishes by category and status
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Category filters */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-christmas-red">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "christmas" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category.value)}
                className="flex items-center space-x-1"
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Status filters */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-christmas-red">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <Button
                key={status.value}
                variant={selectedStatus === status.value ? "christmas" : "outline"}
                size="sm"
                onClick={() => onStatusChange(status.value)}
                className="flex items-center space-x-1"
              >
                <span>{status.icon}</span>
                <span>{status.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 