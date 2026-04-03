import type { TimelineEntry } from '../types'

interface Props {
  entries: TimelineEntry[]
}

export default function TimelinePanel({ entries }: Props) {
  return (
    <div className="card p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Activity Timeline</h3>
      <ol className="relative border-l border-gray-200 ml-2 space-y-4">
        {entries.map((entry, i) => (
          <li key={entry.id} className="ml-4">
            <span className={`absolute -left-1.5 mt-1 w-3 h-3 rounded-full border-2 border-white ${i === 0 ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <p className="text-sm font-medium text-gray-800">{entry.action}</p>
            <p className="text-xs text-gray-500">{entry.actor} · {entry.timestamp}</p>
            {entry.note && <p className="text-xs text-gray-500 mt-0.5 italic">{entry.note}</p>}
          </li>
        ))}
      </ol>
    </div>
  )
}
