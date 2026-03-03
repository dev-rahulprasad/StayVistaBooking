import { useContext, useState } from "react"
import { AuthContext } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"

export default function Login() {
  const { login, signup } = useContext(AuthContext)
  const navigate = useNavigate()
  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const resetMessages = () => {
    setError("")
    setSuccess("")
  }

  const handleLogin = () => {
    resetMessages()

    if (!email || !password) {
      setError("Please enter email and password.")
      return
    }

    const result = login({ email, password })
    if (!result.ok) {
      setError(result.message)
      return
    }

    setSuccess(result.message)
    navigate("/dashboard")
  }

  const handleSignup = () => {
    resetMessages()

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill all fields.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    const result = signup({ name, email, password })
    if (!result.ok) {
      setError(result.message)
      return
    }

    setSuccess(result.message)
    navigate("/dashboard")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (mode === "login") {
      handleLogin()
      return
    }
    handleSignup()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-emerald-100">
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 md:px-6">
        <h1 className="text-2xl font-extrabold text-slate-900">StayVista Booking</h1>
        <Link
          to="/"
          className="rounded-lg border border-cyan-200 bg-white/80 px-4 py-2 text-sm font-semibold text-cyan-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
        >
          Homepage
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-6xl items-center justify-center px-4 pb-10 md:px-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl border border-cyan-100 bg-white/90 p-6 shadow-xl backdrop-blur md:p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            My Account
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
            Login or Signup
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Continue to manage bookings, profile, and availability.
          </p>

          <div className="mt-6 mb-6 grid grid-cols-2 gap-2 rounded-xl bg-cyan-50 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login")
                resetMessages()
              }}
              className={`rounded-lg py-2 text-sm font-semibold transition-all duration-300 ${
                mode === "login"
                  ? "bg-white text-cyan-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup")
                resetMessages()
              }}
              className={`rounded-lg py-2 text-sm font-semibold transition-all duration-300 ${
                mode === "signup"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Signup
            </button>
          </div>

          <div className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-lg border border-cyan-200 bg-white px-3 py-2.5 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border border-cyan-200 bg-white px-3 py-2.5 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full rounded-lg border border-cyan-200 bg-white px-3 py-2.5 pr-16 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {mode === "signup" && (
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="w-full rounded-lg border border-cyan-200 bg-white px-3 py-2.5 pr-16 outline-none transition-all duration-300 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            )}
          </div>

          {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
          {success && <p className="mt-4 text-sm text-emerald-700">{success}</p>}

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 py-2.5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-cyan-700 hover:to-emerald-700"
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </main>
    </div>
  )
}
