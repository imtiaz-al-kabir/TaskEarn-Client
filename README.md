# Micro Task Client (TaskEarn – React Frontend)

**Standalone React application** for the TaskEarn micro-tasking platform.

- **Live Site:** [https://micro-task-project.web.app/](https://micro-task-project.web.app/)

## Admin Credentials
- **Username/Email:** admin@taskearn.com
- **Password:** Admin123!


## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Firebase Auth** - Authentication
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Swiper** - Sliders
- **Axios** - HTTP client
- **Stripe.js** - Payment processing (optional)

## Setup

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   *(Use `--legacy-peer-deps` if you encounter peer dependency conflicts with React 19)*

2. **Create `.env` file:**
   ```bash
   cp env.example.txt .env
   ```
   Then fill in:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_FIREBASE_API_KEY=your-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_STRIPE_PK=pk_test_xxx
   VITE_IMGBB_API_KEY=your-imgbb-key
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
micro-task-client/
├── src/
│   ├── components/      # Reusable components (Navbar, Footer, etc.)
│   ├── context/         # React context (AuthContext)
│   ├── layouts/         # Layout components (BasicLayout, DashboardLayout)
│   ├── lib/             # Utilities (api, firebase, imgbb)
│   ├── pages/           # Page components
│   │   ├── dashboard/   # Dashboard pages (role-based)
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── App.jsx          # Main app component with routes
│   ├── App.css
│   ├── index.css
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── index.html
├── vite.config.js
└── package.json
```

## Key Features

- **Modern Glassmorphism UI:** Stunning dark-themed interface with glass effects and smooth Framer Motion animations.
- **Role-Based Dashboards:** Distinct experiences for Workers, Buyers, and Admins via Private Routes.
- **Secure Authentication:** Firebase Email/Password + Google Sign-In with JWT-based session management.
- **Submission & Proof Management:** Workers can submit proof with images (via ImgBB integration).
- **Payment Integration:** Buyers can securely purchase coins using Stripe.
- **Responsive Layout:** Optimized for mobile, tablet, and desktop devices.

## Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard (redirects based on role)
- `/dashboard/worker-home` - Worker dashboard
- `/dashboard/buyer-home` - Buyer dashboard
- `/dashboard/admin-home` - Admin dashboard
- ... (see `src/App.jsx` for all routes)

## Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the client code. **Private keys and secrets go in `.env`** (copy from `env.example.txt`); `.env` is gitignored and must never be committed.

---

*Point `VITE_API_URL` to your deployed micro-task-server API URL when deploying.*
