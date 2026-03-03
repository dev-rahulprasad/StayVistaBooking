import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { BookingContext } from "../context/BookingContext"

export default function Profile() {
  const { user, updateProfile } = useContext(AuthContext)
  const { reassignBookingsToEmail } = useContext(BookingContext)
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const result = updateProfile({
      name,
      email,
      currentPassword,
      newPassword,
      confirmPassword,
    })

    if (!result.ok) {
      setError(result.message)
      return
    }

    if (result.oldEmail !== result.newEmail) {
      reassignBookingsToEmail({
        oldEmail: result.oldEmail,
        newEmail: result.newEmail,
      })
    }

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setSuccess(result.message)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-emerald-100">
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 md:px-6">
        <h1 className="text-2xl font-extrabold text-slate-900">My Account</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/dashboard"
            className="rounded-lg border border-cyan-200 bg-white/80 px-3 py-2 text-sm font-semibold text-cyan-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            Dashboard
          </Link>
          <Link
            to="/bookings"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
          >
            My Bookings
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-10 md:px-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-cyan-100 bg-white/90 p-6 shadow-lg backdrop-blur md:p-8"
        >
          <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-cyan-700">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-cyan-200 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-cyan-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-cyan-200 bg-white px-3 py-2.5 text-sm outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>
          </div>

          <h2 className="mt-8 text-lg font-bold text-slate-900">Change Password</h2>
          <p className="mt-1 text-sm text-slate-500">
            Leave these fields blank if you do not want to change your password.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-cyan-700">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-cyan-200 bg-white px-3 py-2.5 pr-16 text-sm outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
                >
                  {showCurrentPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-cyan-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-cyan-200 bg-white px-3 py-2.5 pr-16 text-sm outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-cyan-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-cyan-200 bg-white px-3 py-2.5 pr-16 text-sm outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
          {success && <p className="mt-4 text-sm text-emerald-700">{success}</p>}

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-cyan-700 hover:to-emerald-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
