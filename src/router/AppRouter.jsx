import { Routes, Route, Navigate } from "react-router-dom"
import { useContext, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import MyBookings from "../pages/MyBookings"
import Profile from "../pages/Profile"
import NotFound from "../pages/NotFound"

export default function AppRouter() {
  const { user } = useContext(AuthContext)
  const location = useLocation()

  useEffect(() => {
    const pageTitles = {
      "/": "Home | StayVista Booking",
      "/login": "Login | StayVista Booking",
      "/dashboard": "Dashboard | StayVista Booking",
      "/bookings": "My Bookings | StayVista Booking",
      "/profile": "My Account | StayVista Booking",
      "/account": "My Account | StayVista Booking",
    }

    document.title = pageTitles[location.pathname] || "404 | StayVista Booking"
  }, [location.pathname])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/bookings"
        element={user ? <MyBookings /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/profile"
        element={user ? <Profile /> : <Navigate to="/login" replace />}
      />

      <Route
        path="/account"
        element={
          user ? <Navigate to="/profile" replace /> : <Navigate to="/login" replace />
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
