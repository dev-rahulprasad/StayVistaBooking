import { createContext, useState } from "react"

export const AuthContext = createContext(null)

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function readCurrentUser() {
  const raw = localStorage.getItem("user")
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    const email = raw.trim().toLowerCase()
    return { id: Date.now(), name: email.split("@")[0], email }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readCurrentUser())

  const signup = ({ name, email, password }) => {
    const users = readJson("users", [])
    const normalizedEmail = email.trim().toLowerCase()
    const exists = users.some((u) => u.email === normalizedEmail)

    if (exists) {
      return { ok: false, message: "Email already registered. Please login." }
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
    }

    const updatedUsers = [...users, newUser]
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    const currentUser = { id: newUser.id, name: newUser.name, email: newUser.email }
    localStorage.setItem("user", JSON.stringify(currentUser))
    setUser(currentUser)

    return { ok: true, message: "Account created successfully." }
  }

  const login = ({ email, password }) => {
    const users = readJson("users", [])
    const normalizedEmail = email.trim().toLowerCase()
    const matchedUser = users.find(
      (u) => u.email === normalizedEmail && u.password === password
    )

    if (!matchedUser) {
      return { ok: false, message: "Invalid email or password." }
    }

    const currentUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
    }
    localStorage.setItem("user", JSON.stringify(currentUser))
    setUser(currentUser)
    return { ok: true, message: "Login successful." }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  const updateProfile = ({
    name,
    email,
    currentPassword,
    newPassword,
    confirmPassword,
  }) => {
    if (!user?.email) {
      return { ok: false, message: "Please login again." }
    }

    const cleanedName = name?.trim()
    const normalizedEmail = email?.trim().toLowerCase()
    if (!cleanedName || !normalizedEmail) {
      return { ok: false, message: "Name and email are required." }
    }

    const users = readJson("users", [])
    const currentUserIndex = users.findIndex(
      (u) => (user.id ? u.id === user.id : false) || u.email === user.email
    )

    if (currentUserIndex === -1) {
      return { ok: false, message: "User account not found. Please login again." }
    }

    const currentUserRecord = users[currentUserIndex]
    const duplicateEmail = users.some(
      (u, index) => index !== currentUserIndex && u.email === normalizedEmail
    )

    if (duplicateEmail) {
      return { ok: false, message: "This email is already in use." }
    }

    const wantsPasswordChange =
      currentPassword || newPassword || confirmPassword

    let updatedPassword = currentUserRecord.password
    if (wantsPasswordChange) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return {
          ok: false,
          message:
            "Current password, new password and confirm password are required.",
        }
      }

      if (currentPassword !== currentUserRecord.password) {
        return { ok: false, message: "Current password is incorrect." }
      }

      if (newPassword.length < 6) {
        return {
          ok: false,
          message: "New password must be at least 6 characters.",
        }
      }

      if (newPassword !== confirmPassword) {
        return { ok: false, message: "New password and confirm password do not match." }
      }

      updatedPassword = newPassword
    }

    const oldEmail = currentUserRecord.email
    const updatedRecord = {
      ...currentUserRecord,
      name: cleanedName,
      email: normalizedEmail,
      password: updatedPassword,
    }
    users[currentUserIndex] = updatedRecord
    localStorage.setItem("users", JSON.stringify(users))

    const updatedSessionUser = {
      id: updatedRecord.id,
      name: updatedRecord.name,
      email: updatedRecord.email,
    }
    localStorage.setItem("user", JSON.stringify(updatedSessionUser))
    setUser(updatedSessionUser)

    return {
      ok: true,
      message: "Profile updated successfully.",
      oldEmail,
      newEmail: normalizedEmail,
    }
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
