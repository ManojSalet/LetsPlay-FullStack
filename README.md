# Let's Play — Modern Sports Equipment E-Commerce Platform

> A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application built for sports equipment, apparel, and athletic gear e-commerce. Modernized with Vite 5, Tailwind CSS, Lucide icons, and a unified monorepo architecture.

---

## Architecture Overview

```
Let'sPlay/
├── backend/                # Node.js & Express REST API
│   ├── config/             # Database connection setup (Mongoose)
│   ├── controllers/        # Request handlers & business logic
│   ├── middlewares/        # Auth & validation middlewares
│   ├── models/             # Mongoose schemas (User, Product, Order, etc.)
│   ├── routes/             # Express API routes
│   └── docs/               # API documentation & sample payloads
│
├── frontend/               # Modern React 18 SPA (Vite + Tailwind CSS)
│   ├── public/             # Static brand assets & images
│   ├── src/
│   │   ├── API/            # Axios API service client with JWT interceptor
│   │   ├── components/     # UI components (Navbar, Footer, Cart, Checkout, etc.)
│   │   ├── Context/        # React Context providers (CartContext, AuthContext)
│   │   └── hooks/          # Custom utility React hooks
│   ├── index.html          # Single page application entry point
│   ├── tailwind.config.js  # Tailwind CSS theme & styling configuration
│   └── vite.config.js      # Vite build & development server config
│
├── .gitignore              # Unified monorepo ignore rules
├── package.json            # Root workspace scripts (concurrent runner)
└── README.md               # Project documentation & setup guide
```

---

## Features

- **Hierarchical Catalog**: Organized navigation through Categories $\rightarrow$ Sports $\rightarrow$ Equipment $\rightarrow$ Products.
- **Lightning-Fast Vite Build**: Replaced legacy CRA with Vite 5 for instant HMR (<100ms) and optimized production bundles.
- **Responsive Tailwind Design**: Pure Tailwind CSS design system with responsive layouts, accessible controls, and smooth animations.
- **Lucide Iconography**: Integrated Lucide React icon set across the entire user interface.
- **User Authentication**: Secure registration and login with bcrypt password hashing and JSON Web Token (JWT) authorization.
- **Shopping Cart**: Real-time quantity management, persistent local state, subtotal, and dynamic discount calculations.
- **Multi-Step Checkout**: Saved delivery address selection, new address registration, and mock payment gateway processing.
- **Order Tracking**: Comprehensive order summaries and historical order log.
- **Product Detail Suite**: Multi-image view switcher, tabbed technical specifications, customer rating stars, and instant "Buy Now" flow.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18, React Router v6 |
| **Build & Tooling** | Vite 5, PostCSS, Autoprefixer |
| **Styling & UI** | Tailwind CSS, Lucide React, React-Slick |
| **API Client** | Axios (with token interceptor) |
| **Backend Runtime** | Node.js, Express.js |
| **Database & ODM** | MongoDB, Mongoose ODM |
| **Security & Auth** | JSON Web Tokens (JWT), bcryptjs |

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017` or a MongoDB Atlas URI

### 2. Environment Setup

#### Backend Configuration
Copy `.env.example` to `.env` inside `backend/`:
```bash
cp backend/.env.example backend/.env
```
Configure your `MONGO_URI`, `JWT_SECRET`, and email credentials in `backend/.env`.

#### Frontend Configuration
Copy `.env.example` to `.env` inside `frontend/`:
```bash
cp frontend/.env.example frontend/.env
```
Ensure `VITE_API_BASE_URL` points to `http://localhost:5000/api`.

### 3. Installation & Development

#### Option A: One-Command Monorepo Runner (Recommended)
From the project root:
```bash
# Install dependencies across all packages
npm run install:all

# Run backend and frontend concurrently
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

#### Option B: Running Individually

**Backend Server:**
```bash
cd backend
npm install
npm run dev
```

**Frontend Client:**
```bash
cd frontend
npm install
npm run dev
```

---

## REST API Overview

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user & return JWT token | No |
| `GET` | `/api/products/all` | Fetch all available products | No |
| `GET` | `/api/products/:productId` | Fetch single product details | No |
| `GET` | `/api/products/equipment/:equipmentId` | Fetch products for specific equipment | No |
| `GET` | `/api/sports` | List all sports categories | No |
| `GET` | `/api/equipment/by-sport/:sportId` | Fetch equipment grouped by sport | No |
| `GET` | `/api/cart` | Retrieve current user's cart | Yes |
| `POST` | `/api/cart/add` | Add product to cart | Yes |
| `PUT` | `/api/cart/update` | Update item quantity in cart | Yes |
| `DELETE` | `/api/cart/remove/:productId` | Remove product from cart | Yes |
| `POST` | `/api/addresses/add` | Save new shipping address | Yes |
| `GET` | `/api/addresses/:userId` | Get user's saved addresses | Yes |
| `POST` | `/api/orders/create` | Create an order from active cart | Yes |
| `GET` | `/api/orders/allOrders` | Retrieve user's order history | Yes |
| `POST` | `/api/payments/process` | Process mock payment transaction | Yes |

---

## Production Build

To produce an optimized production bundle:
```bash
npm run build
```
Vite outputs production-ready assets to `frontend/dist/`.
