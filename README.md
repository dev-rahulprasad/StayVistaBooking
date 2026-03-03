# StayVista Booking App

A React + Vite hotel booking frontend with:
- Login and signup
- Public homepage and protected dashboard/account routes
- Room booking with availability checks
- Booking modification and cancellation
- Profile update (name, email, password)
- Responsive UI with custom color-coded calendar date picker

## Tech Stack
- React 19
- React Router
- Tailwind CSS 4
- Vite 7

## Prerequisites
- Node.js 18+ (recommended: latest LTS)
- npm 9+

## Setup
1. Clone or download this project.
2. Open terminal in project root.
3. Install dependencies:

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

Then open the local URL shown by Vite (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Project Structure

```text
src/
  components/
    AvailabilityCalendar.jsx
    CalendarDateField.jsx
    RoomCard.jsx
  context/
    AuthContext.jsx
    BookingContext.jsx
  pages/
    Home.jsx
    Login.jsx
    Dashboard.jsx
    MyBookings.jsx
    Profile.jsx
    NotFound.jsx
  router/
    AppRouter.jsx
  services/
    roomService.js
```

## Routing Summary
- `/` -> Homepage (public)
- `/login` -> Login / Signup (public)
- `/dashboard` -> Room dashboard (protected)
- `/bookings` -> My bookings (protected)
- `/profile` -> Profile edit (protected)
- `/account` -> Redirects:
  - logged in -> `/profile`
  - logged out -> `/login`
- `*` -> 404 page

## Notes
- Data persistence currently uses `localStorage` (`users`, `user`, `bookings`).
- This is a frontend-only project (no backend/API).
