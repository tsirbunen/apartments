'use client'

interface Props {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}

export default function ToggleFilter({ label, value, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-1 px-3 py-1 rounded-full border text-sm transition-colors ${
        value
          ? 'border-gray-900 bg-gray-900 text-white'
          : 'border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
      {value && (
        <span
          role="button"
          aria-label={`Tyhjennä ${label} suodatin`}
          onClick={(e) => {
            e.stopPropagation()
            onChange(false)
          }}
          className="ml-0.5 text-red-400 hover:text-red-300 leading-none"
        >
          ×
        </span>
      )}
    </button>
  )
}
