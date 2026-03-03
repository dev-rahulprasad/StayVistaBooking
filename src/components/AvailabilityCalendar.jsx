function formatMonthTitle(dateValue) {
  const date = new Date(dateValue)
  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  })
}

function getDayNumber(dateValue) {
  return new Date(dateValue).getDate()
}

function getDayOfWeek(dateValue) {
  return new Date(dateValue).getDay()
}

function groupDatesByMonth(dates) {
  const map = new Map()
  dates.forEach((item) => {
    const key = item.dateValue.slice(0, 7)
    if (!map.has(key)) {
      map.set(key, [])
    }
    map.get(key).push(item)
  })
  return Array.from(map.entries())
}

export default function AvailabilityCalendar({
  label,
  dates,
  selectedDate,
  onSelectDate,
}) {
  const grouped = groupDatesByMonth(dates)

  return (
    <div className="rounded-xl border border-cyan-100 bg-white/80 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cyan-700">
        {label}
      </p>

      <div className="mb-2 flex items-center gap-2 text-[11px]">
        <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">
          Available
        </span>
        <span className="rounded-full bg-rose-100 px-2 py-0.5 font-semibold text-rose-700">
          Unavailable
        </span>
      </div>

      <div className="space-y-3">
        {grouped.map(([monthKey, monthDates]) => {
          const firstDate = `${monthKey}-01`
          const firstDayOffset = getDayOfWeek(monthDates[0].dateValue)

          return (
            <div key={monthKey}>
              <h4 className="mb-1 text-xs font-bold text-slate-700">
                {formatMonthTitle(firstDate)}
              </h4>

              <div className="mb-1 grid grid-cols-7 gap-1 text-[10px] font-semibold text-slate-400">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOffset }).map((_, idx) => (
                  <span key={`${monthKey}-empty-${idx}`} />
                ))}

                {monthDates.map((item) => {
                  const isSelected = selectedDate === item.dateValue
                  const isUnavailable = item.unavailable

                  const baseClass =
                    "h-9 rounded-md border text-xs font-semibold transition-all duration-200"

                  const availableClass =
                    "cursor-pointer border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"

                  const unavailableClass =
                    "cursor-not-allowed border-rose-200 bg-rose-50 text-rose-700"

                  const selectedClass = isSelected
                    ? "ring-2 ring-cyan-500 border-cyan-500 bg-cyan-100 text-slate-900"
                    : ""

                  return (
                    <button
                      key={item.dateValue}
                      type="button"
                      disabled={isUnavailable}
                      onClick={() => onSelectDate(item.dateValue)}
                      className={`${baseClass} ${
                        isUnavailable ? unavailableClass : availableClass
                      } ${selectedClass}`}
                    >
                      {getDayNumber(item.dateValue)}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
