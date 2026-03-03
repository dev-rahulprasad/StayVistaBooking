import { useContext, useEffect, useMemo, useState } from "react"
import { BookingContext } from "../context/BookingContext"
import { AuthContext } from "../context/AuthContext"
import { lockBodyScroll, unlockBodyScroll } from "../utils/scrollLock"

const DAY_MS = 24 * 60 * 60 * 1000

function calculateNights(startDate, endDate) {
  return Math.round((new Date(endDate) - new Date(startDate)) / DAY_MS)
}

export default function RoomCard({
  room,
  serialNumber,
  selectedStartDate,
  selectedEndDate,
}) {
  const { user } = useContext(AuthContext)
  const { bookings, addBooking, hasRoomConflict } = useContext(BookingContext)

  const [message, setMessage] = useState("")
  const [showPricePopup, setShowPricePopup] = useState(false)
  const [priceDetails, setPriceDetails] = useState(null)

  useEffect(() => {
    if (!showPricePopup) return
    lockBodyScroll()

    return () => {
      unlockBodyScroll()
    }
  }, [showPricePopup])

  useEffect(() => {
    if (!showPricePopup) return

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowPricePopup(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [showPricePopup])

  useEffect(() => {
    setMessage("")
    setPriceDetails(null)
    setShowPricePopup(false)
  }, [selectedEndDate, selectedStartDate])

  const isBookedByMe = useMemo(() => {
    if (!user?.email) return false
    return bookings.some(
      (booking) =>
        booking.roomName === room.name && booking.userEmail === user.email
    )
  }, [bookings, room.name, user?.email])

  const selectedRangeConflict =
    selectedStartDate && selectedEndDate
      ? hasRoomConflict({
          roomName: room.name,
          startDate: selectedStartDate,
          endDate: selectedEndDate,
        })
      : false

  const availabilityBadge = useMemo(() => {
    if (selectedStartDate && selectedEndDate) {
      return selectedRangeConflict
        ? {
            text: "Unavailable",
            className: "bg-rose-100 text-rose-700",
          }
        : {
            text: "Available",
            className: "bg-emerald-100 text-emerald-800",
          }
    }

    return isBookedByMe
      ? {
          text: "Booked",
          className: "bg-amber-100 text-amber-800",
        }
      : {
          text: "Available",
          className: "bg-emerald-100 text-emerald-800",
        }
  }, [isBookedByMe, selectedEndDate, selectedRangeConflict, selectedStartDate])

  const openPricingPopup = () => {
    if (!selectedStartDate || !selectedEndDate) {
      setMessage("Please select dates from the top filter first.")
      return
    }

    const nights = calculateNights(selectedStartDate, selectedEndDate)
    if (nights <= 0) {
      setMessage("End date must be after start date.")
      return
    }

    if (selectedRangeConflict) {
      setMessage("Room is unavailable for the selected dates.")
      return
    }

    const baseCharge = nights * room.price
    const serviceFee = 199
    const tax = Math.round(baseCharge * 0.12)
    const total = baseCharge + serviceFee + tax

    setPriceDetails({
      nights,
      baseCharge,
      serviceFee,
      tax,
      total,
    })
    setShowPricePopup(true)
    setMessage("")
  }

  const confirmBooking = () => {
    const result = addBooking({
      roomName: room.name,
      startDate: selectedStartDate,
      endDate: selectedEndDate,
      price: room.price,
      userEmail: user?.email,
    })

    setMessage(result.message)
    setShowPricePopup(false)
    if (!result.ok) return

    setPriceDetails(null)
  }

  return (
    <>
      <article className="rounded-xl border border-cyan-100 bg-white/85 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-cyan-700">
              Room #{serialNumber}
            </p>
            <h2 className="text-lg font-bold text-slate-900 capitalize">{room.name}</h2>
          </div>
          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${availabilityBadge.className}`}
          >
            {availabilityBadge.text}
          </span>
        </div>

        <p className="mt-1 text-sm text-slate-600 capitalize">{room.description}</p>
        <p className="mt-3 font-semibold text-slate-900">{`\u20B9${room.price}`} / Night</p>
        {selectedStartDate && selectedEndDate && (
          <p className="mt-3 text-xs font-medium text-slate-500">
            Selected: {selectedStartDate} to {selectedEndDate}
          </p>
        )}

        {selectedStartDate && selectedEndDate && selectedRangeConflict && (
          <p className="mb-3 text-xs font-medium text-rose-600">
            Room is unavailable for the selected dates.
          </p>
        )}

        <button
          onClick={openPricingPopup}
          className="mt-4 w-full cursor-pointer rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-cyan-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400"
          disabled={!selectedStartDate || !selectedEndDate || selectedRangeConflict}
        >
          Review Charges
        </button>

        {message && (
          <p
            className={`mt-2 text-sm ${
              message.toLowerCase().includes("confirmed")
                ? "text-cyan-700"
                : "text-rose-600"
            }`}
          >
            {message}
          </p>
        )}
      </article>

      <div
        onClick={() => setShowPricePopup(false)}
        className={`fixed inset-0 z-40 flex cursor-pointer items-center justify-center bg-slate-900/45 p-4 transition-opacity duration-300 ${
          showPricePopup ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className={`w-full max-w-sm cursor-default rounded-xl border border-cyan-100 bg-white/95 p-5 shadow-2xl backdrop-blur transition-all duration-300 ${
            showPricePopup ? "translate-y-0 scale-100" : "translate-y-2 scale-95"
          }`}
        >
          <h3 className="text-lg font-bold text-slate-900">Booking Charges</h3>
          <p className="mt-1 text-sm text-slate-500">
            {selectedStartDate} to {selectedEndDate}
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-700">
              <span>{priceDetails?.nights || 0} nights</span>
              <span>{`\u20B9${priceDetails?.baseCharge || 0}`}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Service fee</span>
              <span>{`\u20B9${priceDetails?.serviceFee || 0}`}</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Taxes (12%)</span>
              <span>{`\u20B9${priceDetails?.tax || 0}`}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
              <div className="flex justify-between">
                <span>Total</span>
                <span>{`\u20B9${priceDetails?.total || 0}`}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={() => setShowPricePopup(false)}
              className="w-1/2 cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              onClick={confirmBooking}
              className="w-1/2 cursor-pointer rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-cyan-700 hover:to-emerald-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400"
              disabled={!priceDetails}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
