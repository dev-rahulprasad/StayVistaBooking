import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-white to-emerald-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-cyan-100 bg-white/90 p-8 text-center shadow-xl backdrop-blur">
        <p className="text-sm font-semibold uppercase tracking-wider text-rose-600">
          Error 404
        </p>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
          Page Not Found
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          This route does not exist. Return to homepage and continue browsing.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:from-cyan-700 hover:to-emerald-700"
        >
          Go To Homepage
        </Link>
      </div>
    </div>
  )
}
