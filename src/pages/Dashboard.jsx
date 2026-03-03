import { useContext, useMemo } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { BookingContext } from "../context/BookingContext"
import RoomCard from "../components/RoomCard"
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
  const { user, logout } = useContext(AuthContext)
  const { bookings } = useContext(BookingContext)

  const { bookedCount, availableCount } = useMemo(() => {
    const userEmail = user?.email
    if (!userEmail) {
      return { bookedCount: 0, availableCount: rooms.length }
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
      availableCount: Math.max(rooms.length - totalBooked, 0),
    }
  }, [bookings, user?.email])

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
          className="rounded-3xl bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 p-6 text-white shadow-xl md:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {stats.map((stat) => (
                <span
                  key={stat.label}
                  className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white"
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
          className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </section>
      </main>
    </div>
  )
}
