import { createContext, useState } from "react"

export const BookingContext = createContext(null)

function readBookings() {
  try {
    const raw = localStorage.getItem("bookings")
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function isOverlapping(startA, endA, startB, endB) {
  return new Date(startA) < new Date(endB) && new Date(endA) > new Date(startB)
}

function isWithinNextThirtyDays(startDate, endDate) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastAllowedDay = new Date(today)
  lastAllowedDay.setDate(lastAllowedDay.getDate() + 30)

  const start = new Date(startDate)
  const end = new Date(endDate)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)

  return start >= today && end <= lastAllowedDay
}

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => readBookings())

  const persist = (updatedBookings) => {
    setBookings(updatedBookings)
    localStorage.setItem("bookings", JSON.stringify(updatedBookings))
  }

  const hasRoomConflict = ({ roomName, startDate, endDate, excludeBookingId }) => {
    return bookings.some(
      (booking) =>
        booking.id !== excludeBookingId &&
        booking.userEmail &&
        booking.roomName === roomName &&
        isOverlapping(startDate, endDate, booking.startDate, booking.endDate)
    )
  }

  const addBooking = (booking) => {
    if (!booking.userEmail) {
      return { ok: false, message: "Please login again to continue." }
    }

    if (!isWithinNextThirtyDays(booking.startDate, booking.endDate)) {
      return {
        ok: false,
        message: "Bookings are allowed only within the next 30 days.",
      }
    }

    if (hasRoomConflict(booking)) {
      return {
        ok: false,
        message: "This room is already booked for the selected dates.",
      }
    }

    const bookingWithMeta = {
      ...booking,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    }

    const updated = [...bookings, bookingWithMeta]
    persist(updated)
    return { ok: true, message: "Booking confirmed." }
  }

  const cancelBooking = ({ bookingId, userEmail }) => {
    const existingBooking = bookings.find((booking) => booking.id === bookingId)
    if (!existingBooking) {
      return { ok: false, message: "Booking not found." }
    }

    if (existingBooking.userEmail !== userEmail) {
      return { ok: false, message: "You can cancel only your own bookings." }
    }

    const updated = bookings.filter((booking) => booking.id !== bookingId)
    persist(updated)
    return { ok: true, message: "Booking cancelled." }
  }

  const updateBookingDates = ({
    bookingId,
    userEmail,
    startDate,
    endDate,
  }) => {
    const bookingToUpdate = bookings.find((booking) => booking.id === bookingId)
    if (!bookingToUpdate) {
      return { ok: false, message: "Booking not found." }
    }

    if (bookingToUpdate.userEmail !== userEmail) {
      return { ok: false, message: "You can modify only your own bookings." }
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return { ok: false, message: "End date must be after start date." }
    }

    if (!isWithinNextThirtyDays(startDate, endDate)) {
      return {
        ok: false,
        message: "Bookings are allowed only within the next 30 days.",
      }
    }

    if (
      hasRoomConflict({
        roomName: bookingToUpdate.roomName,
        startDate,
        endDate,
        excludeBookingId: bookingId,
      })
    ) {
      return {
        ok: false,
        message: "This room is already booked for the selected dates.",
      }
    }

    const updated = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, startDate, endDate } : booking
    )
    persist(updated)
    return { ok: true, message: "Booking updated successfully." }
  }

  const reassignBookingsToEmail = ({ oldEmail, newEmail }) => {
    if (!oldEmail || !newEmail || oldEmail === newEmail) {
      return { ok: true }
    }

    const updated = bookings.map((booking) =>
      booking.userEmail === oldEmail
        ? { ...booking, userEmail: newEmail }
        : booking
    )
    persist(updated)
    return { ok: true }
  }

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        cancelBooking,
        updateBookingDates,
        hasRoomConflict,
        reassignBookingsToEmail,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}
