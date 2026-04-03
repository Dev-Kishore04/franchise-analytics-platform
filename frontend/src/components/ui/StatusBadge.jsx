// src/components/ui/StatusBadge.jsx

const statusConfig = {
  Active: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    dot: 'bg-primary',
  },
  Pending: {
    bg: 'bg-tertiary/10',
    text: 'text-tertiary',
    dot: 'bg-tertiary',
  },
  Inactive: {
    bg: 'bg-on-surface-variant/10',
    text: 'text-on-surface-variant',
    dot: 'bg-on-surface-variant',
  },
}

export default function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.Inactive
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${cfg.dot}`} />
      {status}
    </span>
  )
}
