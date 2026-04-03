import { STATUS_CONFIG } from '../data/mockData'

interface Props {
  status: string
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const config = STATUS_CONFIG[status] ?? {
    label: status, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200'
  }
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${sizeClass} ${config.color} ${config.bg} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')}`} />
      {config.label}
    </span>
  )
}
