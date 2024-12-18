import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check, Clock, Gift } from "lucide-react"
import type { Wish } from "@/types"

interface WishTimelineProps {
  wish: Wish
  onStatusUpdate: (wishId: string, newStatus: Wish['status']) => Promise<void>
}

const statusOrder: Wish['status'][] = ['pending', 'approved', 'delivered']

export function WishTimeline({ wish, onStatusUpdate }: WishTimelineProps) {
  const currentStatusIndex = statusOrder.indexOf(wish.status)

  const getStatusIcon = (status: Wish['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'approved':
        return <Check className="h-4 w-4" />
      case 'delivered':
        return <Gift className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: Wish['status'], isActive: boolean) => {
    const baseColors = {
      pending: 'text-yellow-600',
      approved: 'text-christmas-green',
      delivered: 'text-christmas-red',
    }

    return cn(
      'transition-colors duration-200',
      baseColors[status],
      isActive ? 'opacity-100' : 'opacity-50'
    )
  }

  return (
    <div className="relative p-4 border-2 border-christmas-gold rounded-lg bg-white">
      <div className="mb-4">
        <h3 className="font-bold text-christmas-red">{wish.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{wish.description}</p>
      </div>

      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200">
          <div
            className="h-full bg-christmas-green transition-all duration-500"
            style={{
              width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Status Points */}
        {statusOrder.map((status, index) => {
          const isActive = index <= currentStatusIndex
          const canTransition = index === currentStatusIndex + 1

          return (
            <div key={status} className="relative flex flex-col items-center">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-8 h-8 rounded-full border-2",
                  isActive
                    ? "border-christmas-green bg-white"
                    : "border-gray-300 bg-gray-50",
                  canTransition && "hover:border-christmas-red cursor-pointer"
                )}
                onClick={() => canTransition && onStatusUpdate(wish.id, status)}
                disabled={!canTransition}
              >
                <span className={getStatusColor(status, isActive)}>
                  {getStatusIcon(status)}
                </span>
              </Button>
              <span
                className={cn(
                  "mt-2 text-xs font-medium capitalize",
                  getStatusColor(status, isActive)
                )}
              >
                {status}
              </span>
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Last updated: {new Date(wish.updatedAt || wish.createdAt).toLocaleDateString()}
      </div>
    </div>
  )
} 