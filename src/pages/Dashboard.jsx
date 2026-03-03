import { useContext, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { BookingContext } from "../context/BookingContext"
import RoomCard from "../components/RoomCard"
import CalendarDateField from "../components/CalendarDateField"
import { rooms } from "../services/roomService"

const DASHBOARD_ACTIONS = [
  {
    to: "/bookings",
    label: "My Bookings",
    className:
      "rounded-lg bg-white px-4 py-2 text-sm font-semibold text-cyan-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-50",
  },
  {
    to: "/profile",
    label: "Edit Profile",
    className:
      "rounded-lg border border-white/60 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20",
  },
]

export default function Dashboard() {
  const PAGE_SIZE = 9
  const { user, logout } = useContext(AuthContext)
  const { bookings, hasRoomConflict } = useContext(BookingContext)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const nextThirtyDays = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return Array.from({ length: 30 }).map((_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index)
      return {
        dateValue: date.toISOString().slice(0, 10),
        unavailable: false,
      }
    })
  }, [])

  const endDateOptions = useMemo(() => {
    if (!startDate) {
      return nextThirtyDays.map((item) => ({ ...item, unavailable: true }))
    }

    return nextThirtyDays.map((item) => ({
      ...item,
      unavailable: item.dateValue <= startDate,
    }))
  }, [nextThirtyDays, startDate])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [startDate, endDate])

  const availableForSelectedDatesCount = useMemo(() => {
    if (!startDate || !endDate) return rooms.length

    return rooms.reduce((count, room) => {
      const unavailable = hasRoomConflict({
        roomName: room.name,
        startDate,
        endDate,
      })
      return unavailable ? count : count + 1
    }, 0)
  }, [endDate, hasRoomConflict, startDate])

  const visibleRooms = useMemo(
    () => rooms.slice(0, visibleCount),
    [visibleCount]
  )

  const canLoadMore = visibleCount < rooms.length

  const { bookedCount, availableCount } = useMemo(() => {
    const userEmail = user?.email
    if (!userEmail) {
      return { bookedCount: 0, availableCount: availableForSelectedDatesCount }
    }

    const myBookedRoomNames = new Set()
    for (const booking of bookings) {
      if (booking.userEmail === userEmail) {
        myBookedRoomNames.add(booking.roomName)
      }
    }

    const totalBooked = myBookedRoomNames.size
    return {
      bookedCount: totalBooked,
      availableCount: availableForSelectedDatesCount,
    }
  }, [availableForSelectedDatesCount, bookings, user?.email])

  const stats = [
    { label: "Booked", value: bookedCount },
    { label: "Available", value: availableCount },
  ]

  const welcomeText = user?.name
    ? `Welcome, ${user.name}`
    : "Choose your perfect stay"

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-emerald-100">
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 md:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">
            StayVista Booking
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
            Dashboard / Available Rooms
          </h1>
          <p className="mt-1 text-sm text-slate-600">{welcomeText}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Logout
        </button>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6">
        <section
          aria-label="Dashboard Overview"
          className="rounded-2xl bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 p-6 text-white shadow-xl md:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {stats.map((stat) => (
                <span
                  key={stat.label}
                  className="rounded-lg bg-white/20 px-3 py-1 text-xs font-semibold text-white"
                >
                  {stat.label}: {stat.value}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {DASHBOARD_ACTIONS.map((action) => (
                <Link key={action.to} to={action.to} className={action.className}>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-label="Available Rooms"
          className="mt-6"
        >
          <div className="mb-6 rounded-xl border border-cyan-100 bg-white/90 p-4 shadow-sm backdrop-blur md:p-5">
            <h2 className="text-base font-bold text-slate-900 md:text-lg">
              Select Stay Dates
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              All rooms are shown. Badges indicate availability for selected dates.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <CalendarDateField
                label="Check in (next 30 days)"
                dates={nextThirtyDays}
                value={startDate}
                placeholder="Select check in date"
                onChange={(value) => {
                  setStartDate(value)
                  setEndDate("")
                }}
              />

              <CalendarDateField
                label={startDate ? "Check out" : "Check out (select check in first)"}
                dates={endDateOptions}
                value={endDate}
                placeholder={startDate ? "Select check out date" : "Select check in first"}
                disabled={!startDate}
                onChange={setEndDate}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visibleRooms.map((room, index) => (
              <RoomCard
                key={room.id}
                room={room}
                serialNumber={index + 1}
                selectedStartDate={startDate}
                selectedEndDate={endDate}
              />
            ))}
          </div>

          {canLoadMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="rounded-lg border border-cyan-200 bg-white px-5 py-2.5 text-sm font-semibold text-cyan-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-cyan-50"
              >
                Load More Rooms
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
