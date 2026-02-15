# 🏗️ Waste-Trace

**A decentralized digital marketplace for Construction & Demolition (C&D) waste management with Green Credit incentives.**

Waste-Trace connects Civil Site Owners (Generators) with Recycling Plant Owners (Recyclers) to promote responsible C&D waste disposal, track recyclable materials, and reward sustainable practices through a Green Credit system.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Running the Project](#-running-the-project)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Demo Accounts](#-demo-accounts)
- [Green Credit Formula](#-green-credit-formula)

---

## ✨ Features

| Feature                  | Description                                                     |
| ------------------------ | --------------------------------------------------------------- |
| **Dual-Role Auth**       | Register/login as Generator or Recycler with JWT authentication |
| **Green Credit Engine**  | Automatic credit calculation using `GC = Q × P × R × L`        |
| **Waste Tracking**       | 6-step status timeline (Pending → QC Completed)                 |
| **QR Waste Passport**    | Unique QR code generated for every waste load                   |
| **Quality Check (QC)**   | Live credit calculation with Purity / Recovery / Location breakdown |
| **Green Wallet**         | View balance, transfer credits to others, sell for ₹            |
| **Marketplace**          | Redeem credits for recycled materials                           |
| **PDF Certificate**      | Downloadable recycling certificate per load                     |
| **Leaderboard**          | Top builders ranked with podium + table                         |
| **Analytics Dashboards** | Area charts, bar charts, and pie charts (Recharts)              |
| **Segregation Badges**   | Grade A / B / C badges based on average purity score            |

---

## 🛠️ Tech Stack

### Frontend
| Technology       | Version | Purpose                    |
| ---------------- | ------- | -------------------------- |
| React            | 18.3    | UI library                 |
| Vite             | 5.4     | Build tool & dev server    |
| TailwindCSS      | 3.4     | Utility-first CSS          |
| React Router DOM | 6.27    | Client-side routing        |
| Recharts         | 2.13    | Charts & data visualization|
| React Icons      | 5.3     | Icon library               |
| Axios            | 1.7     | HTTP client                |

### Backend
| Technology   | Version | Purpose                 |
| ------------ | ------- | ----------------------- |
| Node.js      | 18+     | Runtime                 |
| Express      | 4.21    | Web framework           |
| MongoDB      | 6+      | Database                |
| Mongoose     | 8.7     | MongoDB ODM             |
| JSON Web Token | 9.0   | Authentication          |
| bcryptjs     | 2.4     | Password hashing        |
| PDFKit       | 0.15    | PDF certificate generation |
| qrcode       | 1.5     | QR waste passport generation |
| multer       | 1.4     | File uploads            |

---

## 📁 Project Structure

```
Waste-Trace/
├── client/                           # Frontend (Vite + React)
│   ├── src/
│   │   ├── components/
│   │   │   └── DashboardLayout.jsx   # Responsive sidebar layout
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # JWT auth state management
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # Public landing page
│   │   │   ├── Login.jsx             # Login form
│   │   │   ├── Register.jsx          # Registration with role selection
│   │   │   ├── Leaderboard.jsx       # Global leaderboard
│   │   │   ├── generator/            # Generator-only pages
│   │   │   │   ├── GeneratorHome.jsx # Dashboard with stats & charts
│   │   │   │   ├── RequestPickup.jsx # Submit waste pickup requests
│   │   │   │   ├── Tracking.jsx      # Track waste load status + QR
│   │   │   │   ├── Wallet.jsx        # Green Wallet (balance/transfer/sell)
│   │   │   │   └── Marketplace.jsx   # Redeem credits for products
│   │   │   └── recycler/             # Recycler-only pages
│   │   │       ├── PlantDashboard.jsx# Plant analytics & stats
│   │   │       ├── IncomingLoads.jsx # Manage incoming waste loads
│   │   │       ├── QualityCheck.jsx  # QC inspection + credit calc
│   │   │       └── PlantSettings.jsx # Add/edit plant details
│   │   ├── utils/
│   │   │   └── api.js               # Axios instance with JWT interceptor
│   │   ├── App.jsx                   # Root component with routing
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Tailwind + custom design system
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                           # Backend (Express + MongoDB)
│   ├── middleware/
│   │   └── auth.js                   # JWT verification + role guards
│   ├── models/
│   │   ├── User.js                   # Generator / Recycler user model
│   │   ├── Plant.js                  # Recycling plant model
│   │   ├── WasteRequest.js           # Waste pickup request model
│   │   ├── WalletTransaction.js      # Credit transaction ledger
│   │   └── MarketplaceItem.js        # Marketplace product model
│   ├── routes/
│   │   ├── authRoutes.js             # POST /register, /login, GET /profile
│   │   ├── wasteRoutes.js            # CRUD + status updates + QR
│   │   ├── plantRoutes.js            # CRUD + geolocation
│   │   ├── walletRoutes.js           # Balance, transfer, sell, history
│   │   ├── marketplaceRoutes.js      # List items, redeem with credits
│   │   ├── leaderboardRoutes.js      # Top generators by credits
│   │   └── certificateRoutes.js      # PDF certificate download
│   ├── utils/
│   │   └── greenCredit.js            # GC = Q × P × R × L calculation
│   ├── server.js                     # Express app + MongoDB connection
│   ├── seed.js                       # Demo data seeder
│   ├── .env                          # Environment variables
│   └── package.json
│
└── README.md                         # ← You are here
```

---

## ✅ Prerequisites

Make sure the following are installed on your machine:

| Software     | Minimum Version | Download Link                         |
| ------------ | --------------- | ------------------------------------- |
| **Node.js**  | v18.0+          | https://nodejs.org/                   |
| **npm**      | v9.0+           | _(comes with Node.js)_                |
| **MongoDB**  | v6.0+           | https://www.mongodb.com/try/download  |

> **Tip:** You can also use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier) instead of installing MongoDB locally. Just update the `MONGO_URI` in the `.env` file.

To verify your installations, run:

```bash
node -v        # Should print v18.x.x or higher
npm -v         # Should print 9.x.x or higher
mongod --version  # Should print v6.x or higher (if installed locally)
```

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Waste-Trace
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

The server `.env` file is located at `server/.env`. The default values are:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/waste-trace
JWT_SECRET=waste-trace-super-secret-key-2024
```

> ⚠️ **Important:** For production, change `JWT_SECRET` to a strong random string and use a secure MongoDB connection URI.

| Variable     | Description                              | Default                                   |
| ------------ | ---------------------------------------- | ----------------------------------------- |
| `PORT`       | Port for the Express server              | `5000`                                    |
| `MONGO_URI`  | MongoDB connection string                | `mongodb://localhost:27017/waste-trace`    |
| `JWT_SECRET` | Secret key for signing JWT tokens        | `waste-trace-super-secret-key-2024`       |

### 5. Seed the database with demo data

```bash
cd server
npm run seed
```

This script populates the database with:
- 2 demo user accounts (1 Generator + 1 Recycler)
- Sample recycling plants
- Waste pickup requests in various statuses
- Wallet transactions & marketplace items

---

## ▶️ Running the Project

You need **two terminals** — one for the backend and one for the frontend.

### Terminal 1 — Start the Backend

```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 Waste-Trace server running on port 5000
```

### Terminal 2 — Start the Frontend

```bash
cd client
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:3000/
```

### Open in browser

Navigate to **http://localhost:3000** to view the application.

> **Note:** The Vite dev server automatically proxies all `/api/*` requests to the Express backend on port 5000, so both servers work together seamlessly.

---

## 🔌 API Reference

All API endpoints are prefixed with `/api`. Authentication is via `Bearer <token>` in the `Authorization` header.

### Auth — `/api/auth`
| Method | Endpoint    | Description               | Auth Required |
| ------ | ----------- | ------------------------- | ------------- |
| POST   | `/register` | Register a new user       | No            |
| POST   | `/login`    | Login & receive JWT       | No            |
| GET    | `/profile`  | Get current user profile  | Yes           |

### Waste Requests — `/api/waste`
| Method | Endpoint         | Description                          | Auth Required |
| ------ | ---------------- | ------------------------------------ | ------------- |
| POST   | `/`              | Create a waste pickup request        | Generator     |
| GET    | `/`              | List requests (filtered by role)     | Yes           |
| GET    | `/:id`           | Get single request details           | Yes           |
| PUT    | `/:id/status`    | Update request status                | Recycler      |
| GET    | `/:id/qr`        | Generate QR waste passport           | Yes           |

### Plants — `/api/plants`
| Method | Endpoint  | Description              | Auth Required |
| ------ | --------- | ------------------------ | ------------- |
| POST   | `/`       | Register a new plant     | Recycler      |
| GET    | `/`       | List recycler's plants   | Recycler      |
| PUT    | `/:id`    | Update plant details     | Recycler      |

### Wallet — `/api/wallet`
| Method | Endpoint     | Description                    | Auth Required |
| ------ | ------------ | ------------------------------ | ------------- |
| GET    | `/balance`   | Get current credit balance     | Yes           |
| GET    | `/history`   | Get transaction history        | Yes           |
| POST   | `/transfer`  | Transfer credits to a user     | Yes           |
| POST   | `/sell`      | Sell credits for ₹             | Yes           |

### Marketplace — `/api/marketplace`
| Method | Endpoint      | Description                     | Auth Required |
| ------ | ------------- | ------------------------------- | ------------- |
| GET    | `/`           | List available marketplace items| Yes           |
| POST   | `/:id/redeem` | Redeem credits for an item      | Yes           |

### Leaderboard — `/api/leaderboard`
| Method | Endpoint | Description                     | Auth Required |
| ------ | -------- | ------------------------------- | ------------- |
| GET    | `/`      | Get top builders by credits     | Yes           |

### Certificate — `/api/certificate`
| Method | Endpoint   | Description                          | Auth Required |
| ------ | ---------- | ------------------------------------ | ------------- |
| GET    | `/:id`     | Download recycling certificate (PDF) | Yes           |

### Health Check
| Method | Endpoint      | Description        | Auth Required |
| ------ | ------------- | ------------------ | ------------- |
| GET    | `/api/health` | Server health ping | No            |

---

## 👤 Demo Accounts

After running `npm run seed`, you can log in with these accounts:

| Role        | Email                        | Password       |
| ----------- | ---------------------------- | -------------- |
| Generator   | `priyanshi@wastetrace.com`   | `password123`  |
| Recycler    | `greenbuild@wastetrace.com`  | `password123`  |

---

## 🌿 Green Credit Formula

The platform uses a multi-factor formula to calculate Green Credits for each waste load:

```
GC = Q × P × R × L
```

| Factor | Name               | Description                                           |
| ------ | ------------------ | ----------------------------------------------------- |
| **Q**  | Quantity Multiplier | Based on weight (tonnes) of the waste load            |
| **P**  | Purity Factor      | Segregation quality of the waste (0.0 – 1.0)          |
| **R**  | Recovery Factor    | Material-specific recyclability rate                  |
| **L**  | Location Factor    | Proximity bonus between site and recycling plant      |

The calculation engine is implemented in `server/utils/greenCredit.js` and executed during the Quality Check (QC) step by Recyclers.

---

## 🏗️ Production Build

To create an optimized production build of the frontend:

```bash
cd client
npm run build
```

The output will be in the `client/dist/` folder, ready to be served by any static file host or the Express backend.

To start the backend in production:

```bash
cd server
npm start
```

---

## 📄 License

This project is developed as part of a sustainability initiative. All rights reserved.
