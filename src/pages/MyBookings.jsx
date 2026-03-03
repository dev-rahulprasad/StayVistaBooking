import { useContext, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { BookingContext } from "../context/BookingContext"
import { AuthContext } from "../context/AuthContext"
import CalendarDateField from "../components/CalendarDateField"

const DAY_MS = 24 * 60 * 60 * 1000

function getDateBounds() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 30)

  return {
    min: today.toISOString().slice(0, 10),
    max: maxDate.toISOString().slice(0, 10),
  }
}

function calculateNights(startDate, endDate) {
  return Math.round((new Date(endDate) - new Date(startDate)) / DAY_MS)
}

export default function MyBookings() {
  const { user } = useContext(AuthContext)
  const { bookings, updateBookingDates, cancelBooking, hasRoomConflict } =
    useContext(BookingContext)

  const [message, setMessage] = useState("")
  const [bookingToEdit, setBookingToEdit] = useState(null)
  const [bookingToCancel, setBookingToCancel] = useState(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [editError, setEditError] = useState("")

  const bounds = useMemo(() => getDateBounds(), [])

  const myBookings = useMemo(() => {
    if (!user?.email) return []
    return bookings.filter((booking) => booking.userEmail === user.email)
  }, [bookings, user?.email])

  const chargeDetails = useMemo(() => {
    if (!bookingToEdit || !startDate || !endDate) return null
    const nights = calculateNights(startDate, endDate)
    if (nights <= 0) return null

    const baseCharge = nights * bookingToEdit.price
    const serviceFee = 199
    const tax = Math.round(baseCharge * 0.12)
    const total = baseCharge + serviceFee + tax
    return { nights, baseCharge, serviceFee, tax, total }
  }, [bookingToEdit, startDate, endDate])

  const editStartCalendarDates = useMemo(() => {
    if (!bookingToEdit) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return Array.from({ length: 30 }).map((_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index)
      const dateValue = date.toISOString().slice(0, 10)
      const unavailable = bookings.some((booking) => {
        if (booking.id === bookingToEdit.id) return false
        if (booking.roomName !== bookingToEdit.roomName) return false
        const day = new Date(dateValue)
        return day >= new Date(booking.startDate) && day < new Date(booking.endDate)
      })

      return { dateValue, unavailable }
    })
  }, [bookingToEdit, bookings])

  const editEndCalendarDates = useMemo(() => {
    if (!bookingToEdit) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return Array.from({ length: 30 }).map((_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() + index)
      const dateValue = date.toISOString().slice(0, 10)

      if (!startDate) return { dateValue, unavailable: true }

      const unavailable =
        dateValue <= startDate ||
        hasRoomConflict({
          roomName: bookingToEdit.roomName,
          startDate,
          endDate: dateValue,
          excludeBookingId: bookingToEdit.id,
        })

      return { dateValue, unavailable }
    })
  }, [bookingToEdit, hasRoomConflict, startDate])

  const openEditModal = (booking) => {
    setBookingToEdit(booking)
    setStartDate(booking.startDate)
    setEndDate(booking.endDate)
    setEditError("")
  }

  const closeEditModal = () => {
    setBookingToEdit(null)
    setStartDate("")
    setEndDate("")
    setEditError("")
  }

  const handleCancelBooking = () => {
    if (!bookingToCancel) return

    const result = cancelBooking({
      bookingId: bookingToCancel.id,
      userEmail: user?.email,
    })
    setMessage(result.message)
    setBookingToCancel(null)
  }

  const handleUpdateBooking = () => {
    if (!bookingToEdit) return

    const result = updateBookingDates({
      bookingId: bookingToEdit.id,
      userEmail: user?.email,
      startDate,
      endDate,
    })

    if (!result.ok) {
      setEditError(result.message)
      return
    }

    setMessage(result.message)
    closeEditModal()
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-emerald-100">
        <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 md:px-6">
          <h1 className="text-2xl font-extrabold text-slate-900">My Bookings</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/profile"
              className="rounded-lg border border-cyan-200 bg-white/80 px-3 py-2 text-sm font-semibold text-cyan-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Edit Profile
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Back to Dashboard
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6">
          {message && (
            <p className="mb-4 rounded-lg border border-cyan-200 bg-white/90 px-4 py-2 text-sm text-cyan-700 shadow-sm">
              {message}
            </p>
          )}

          {myBookings.length === 0 ? (
            <div className="rounded-2xl border border-cyan-100 bg-white/85 p-8 text-center text-slate-600 shadow-sm backdrop-blur">
              No bookings yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-2xl border border-cyan-100 bg-white/85 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <h2 className="text-lg font-bold text-slate-900">{booking.roomName}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {booking.startDate} to {booking.endDate}
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {`\u20B9${booking.price}`} / night
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(booking)}
                      className="rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-cyan-700 hover:to-emerald-700"
                    >
                      Modify Dates
                    </button>
                    <button
                      onClick={() => setBookingToCancel(booking)}
                      className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700"
                    >
                      Cancel
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      <div
        className={`fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4 transition-opacity duration-300 ${
          bookingToEdit ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`w-full max-w-md rounded-2xl border border-cyan-100 bg-white/95 p-5 shadow-2xl backdrop-blur transition-all duration-300 ${
            bookingToEdit ? "translate-y-0 scale-100" : "translate-y-2 scale-95"
          }`}
        >
          <h3 className="text-lg font-bold text-slate-900">Modify Booking</h3>
          <p className="mt-1 text-sm text-slate-600">
            {bookingToEdit?.roomName} ({`\u20B9${bookingToEdit?.price || 0}`} / night)
          </p>

          <div className="mt-4 grid gap-3">
            <CalendarDateField
              label="Check in (next 30 days)"
              dates={editStartCalendarDates}
              value={startDate}
              placeholder="Select check in date"
              onChange={(value) => {
                if (value < bounds.min || value > bounds.max) return
                setStartDate(value)
                setEndDate("")
                setEditError("")
              }}
            />
            <CalendarDateField
              label={startDate ? "Check out" : "Check out (select check in first)"}
              dates={editEndCalendarDates}
              value={endDate}
              placeholder={startDate ? "Select check out date" : "Select check in first"}
              disabled={!startDate}
              onChange={(value) => {
                if (value < bounds.min || value > bounds.max) return
                setEndDate(value)
                setEditError("")
              }}
            />
          </div>

          <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50/60 p-3">
            <h4 className="text-sm font-semibold text-slate-800">Updated Charges</h4>
            {chargeDetails ? (
              <div className="mt-2 space-y-1 text-sm text-slate-700">
                <div className="flex justify-between">
                  <span>{chargeDetails.nights} nights</span>
                  <span>{`\u20B9${chargeDetails.baseCharge}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>{`\u20B9${chargeDetails.serviceFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (12%)</span>
                  <span>{`\u20B9${chargeDetails.tax}`}</span>
                </div>
                <div className="mt-1 border-t border-cyan-200 pt-1 text-base font-bold text-slate-900">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>{`\u20B9${chargeDetails.total}`}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                Select valid dates to see updated charges.
              </p>
            )}
          </div>

          {editError && <p className="mt-3 text-sm text-rose-600">{editError}</p>}

          <div className="mt-5 flex gap-2">
            <button
              onClick={closeEditModal}
              className="w-1/2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={handleUpdateBooking}
              className="w-1/2 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-cyan-700 hover:to-emerald-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4 transition-opacity duration-300 ${
          bookingToCancel ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          className={`w-full max-w-sm rounded-2xl border border-rose-100 bg-white/95 p-5 shadow-2xl backdrop-blur transition-all duration-300 ${
            bookingToCancel ? "translate-y-0 scale-100" : "translate-y-2 scale-95"
          }`}
        >
          <h3 className="text-lg font-bold text-slate-900">Cancel Booking?</h3>
          <p className="mt-2 text-sm text-slate-600">
            This will cancel your booking for{" "}
            <span className="font-semibold text-slate-800">
              {bookingToCancel?.roomName}
            </span>
            .
          </p>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => setBookingToCancel(null)}
              className="w-1/2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Keep
            </button>
            <button
              onClick={handleCancelBooking}
              className="w-1/2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
