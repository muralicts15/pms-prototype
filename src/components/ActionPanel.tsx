import type { AllowedAction } from '../types'

interface Props {
  actions: AllowedAction[]
  onAction: (code: string) => void
}

export default function ActionPanel({ actions, onAction }: Props) {
  if (actions.length === 0) return null

  const variantClass: Record<string, string> = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    danger:    'btn-danger',
    ghost:     'btn-ghost',
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(action => (
        <button
          key={action.code}
          className={variantClass[action.variant] ?? 'btn-secondary'}
          onClick={() => onAction(action.code)}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}
