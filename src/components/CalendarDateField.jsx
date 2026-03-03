import { useState } from "react"
import AvailabilityCalendar from "./AvailabilityCalendar"

function formatDisplayDate(dateValue) {
  if (!dateValue) return ""
  const date = new Date(dateValue)
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export default function CalendarDateField({
  label,
  value,
  onChange,
  dates,
  placeholder,
  disabled = false,
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-cyan-700">
          {label}
        </label>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-lg border border-cyan-200 bg-white px-3 py-2 text-left text-sm text-slate-700 outline-none transition-all duration-300 hover:border-cyan-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          <span>{value ? formatDisplayDate(value) : placeholder}</span>
          <span className="text-xs text-slate-400">Pick</span>
        </button>
      </div>

      {open && !disabled && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/35 p-4 pt-8 sm:items-center">
          <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl border border-cyan-100 bg-white/95 p-4 shadow-2xl backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">{label}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <AvailabilityCalendar
              label={label}
              dates={dates}
              selectedDate={value}
              onSelectDate={(nextDate) => {
                onChange(nextDate)
                setOpen(false)
              }}
            />
          </div>
        </div>
      )}
    </>
  )
}
