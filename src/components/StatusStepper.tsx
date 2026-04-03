import type { ListingStatus } from '../types'

const STEPS: { status: ListingStatus; label: string }[] = [
  { status: 'DRAFT',             label: 'Draft' },
  { status: 'READY_TO_LIST',     label: 'Ready' },
  { status: 'LISTED',            label: 'Listed' },
  { status: 'APPLICATIONS_OPEN', label: 'Accepting' },
  { status: 'UNDER_REVIEW',      label: 'Under Review' },
  { status: 'OFFER_IN_PROGRESS', label: 'Under Offer' },
]

const ORDER: Record<string, number> = {
  DRAFT: 0, READY_TO_LIST: 1, LISTED: 2,
  APPLICATIONS_OPEN: 3, UNDER_REVIEW: 4, OFFER_IN_PROGRESS: 5,
}

interface Props {
  current: ListingStatus
}

export default function StatusStepper({ current }: Props) {
  const currentIdx = ORDER[current] ?? -1

  if (currentIdx === -1) return null // don't show for MAINTENANCE_HOLD, OFF_MARKET etc.

  return (
    <div className="flex items-center gap-0 overflow-x-auto py-1">
      {STEPS.map((step, i) => {
        const isPast    = i < currentIdx
        const isCurrent = i === currentIdx
        const isFuture  = i > currentIdx

        return (
          <div key={step.status} className="flex items-center">
            <div className="flex flex-col items-center min-w-[72px]">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
                ${isCurrent ? 'bg-blue-600 border-blue-600 text-white' : ''}
                ${isPast    ? 'bg-blue-100 border-blue-400 text-blue-700' : ''}
                ${isFuture  ? 'bg-white border-gray-300 text-gray-400' : ''}
              `}>
                {isPast ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] mt-1 text-center leading-tight
                ${isCurrent ? 'text-blue-700 font-semibold' : ''}
                ${isPast    ? 'text-blue-500' : ''}
                ${isFuture  ? 'text-gray-400' : ''}
              `}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-6 mb-4 flex-shrink-0 ${i < currentIdx ? 'bg-blue-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
