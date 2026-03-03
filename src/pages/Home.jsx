import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-emerald-100">
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 md:px-6">
        <h1 className="text-2xl font-extrabold text-slate-900">StayVista Booking</h1>
        <Link
          to="/login"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5"
        >
          Login / Signup
        </Link>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-6">
        <section className="rounded-3xl bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 p-8 text-white shadow-xl md:p-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-100">
            Welcome
          </p>
          <h2 className="mt-2 text-3xl font-extrabold md:text-5xl">
            Find your perfect room
          </h2>
          <p className="mt-3 max-w-2xl text-cyan-50">
            Book premium stays with an easy, modern, and secure booking flow.
          </p>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <Link
            to="/dashboard"
            className="group rounded-2xl border border-cyan-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
              Explore
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">
              Dashboard / Available Rooms
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Browse available rooms and make bookings with charge details.
            </p>
            <p className="mt-4 text-sm font-semibold text-cyan-700 group-hover:text-cyan-800">
              Open Dashboard
            </p>
          </Link>

          <Link
            to="/account"
            className="group rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Profile
            </p>
            <h3 className="mt-2 text-xl font-bold text-slate-900">My Account</h3>
            <p className="mt-2 text-sm text-slate-600">
              Manage profile, email, and password. If not logged in, you will be
              redirected to Login / Signup.
            </p>
            <p className="mt-4 text-sm font-semibold text-emerald-700 group-hover:text-emerald-800">
              Go To Account
            </p>
          </Link>
        </section>
      </main>
    </div>
  )
}
