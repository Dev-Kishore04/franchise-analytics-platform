// src/components/settings/ToggleSwitch.jsx

export default function ToggleSwitch({ enabled, onChange, disabled = false }) {
  return (
    <button
      onClick={() => !disabled && onChange?.(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0
        ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        ${enabled && !disabled ? 'bg-primary' : 'bg-outline-variant'}`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
          ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  )
}
