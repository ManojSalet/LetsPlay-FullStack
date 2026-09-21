# Let's Play — Sports Equipment E-Commerce Platform

> A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application designed for sports equipment and apparel e-commerce.

---

## Architecture Overview

```
Let'sPlay/
├── backend/                # Node.js & Express REST API
│   ├── config/             # Database connection setup
│   ├── controllers/        # Request handlers & business logic
│   ├── middlewares/        # Auth & validation middlewares
│   ├── models/             # Mongoose schemas (User, Product, Order, etc.)
│   ├── routes/             # Express API routes
│   └── docs/               # API documentation & sample payloads
│
├── frontend/               # React 18 Single Page Application (SPA)
│   ├── public/             # Static assets & HTML template
│   └── src/
│       ├── API/            # Axios API service client
│       ├── components/     # UI components (Auth, Cart, Checkout, etc.)
│       ├── Context/        # React Context providers (CartContext, AuthContext)
│       └── hooks/          # Custom utility React hooks
│
├── .gitignore              # Unified monorepo ignore rules
└── README.md               # Project documentation & setup guide
```

---

## Features

- **Hierarchical Catalog**: Organized into Categories $\rightarrow$ Sports $\rightarrow$ Equipment $\rightarrow$ Products.
- **User Authentication**: Secure signup and login with hashed passwords (`bcryptjs`) and JWT token authentication.
- **Shopping Cart**: Real-time quantity increment/decrement, dynamic subtotal & discount calculation.
- **Checkout Flow**: Multi-address management, mock payment processing, and automatic order creation.
- **Order Tracking**: Detailed order summaries and historical order log.
- **Customer Reviews & Wishlist**: Schema and endpoints for product ratings and saved item lists.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router v6, Axios, React-Slick Carousel, Bootstrap 5, CSS Modules |
| **Backend** | Node.js, Express.js, Mongoose ODM, JSON Web Tokens (JWT), Nodemailer |
| **Database** | MongoDB |

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017` or a MongoDB Atlas URI

### 2. Environment Setup

#### Backend Configuration
Copy `.env.example` to `.env` inside `backend/`:
```bash
cp backend/.env.example backend/.env
```
Ensure `MONGO_URI` and `JWT_SECRET` are properly configured.

#### Frontend Configuration
Copy `.env.example` to `.env` inside `frontend/`:
```bash
cp frontend/.env.example frontend/.env
```

### 3. Installation & Running

#### Start the Backend Server:
```bash
cd backend
npm install
npm run dev
# Server runs on http://localhost:5000
```

#### Start the Frontend Client:
```bash
cd frontend
npm install
npm start
# Client runs on http://localhost:3000
```

---

## REST API Overview

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login user & return JWT | No |
| `GET` | `/api/products/all` | Fetch all products | No |
| `GET` | `/api/products/:productId` | Fetch single product details | No |
| `GET` | `/api/sports` | List all sports | No |
| `GET` | `/api/equipment/by-sport/:sportId` | Fetch equipment by sport | No |
| `GET` | `/api/cart` | Get current user's cart | Yes |
| `POST` | `/api/cart/add` | Add product to cart | Yes |
| `POST` | `/api/orders/create` | Create an order from cart | Yes |
| `GET` | `/api/orders/allOrders` | Get order history for user | Yes |
