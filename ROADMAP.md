# 🗺️ "Let's Play" — Project Roadmap & Living Development Tracker

> **Repository**: [`ManojSalet/LetsPlay-FullStack`](https://github.com/ManojSalet/LetsPlay-FullStack.git)  
> **Tech Stack**: Vite 5 + React 18 + Tailwind CSS | Node.js + Express 4 | MongoDB + Mongoose 8  
> **Active Sprint**: **Phase 5 — Administrative Customer & User Management (`AdminCustomers.jsx`)**  
> **Last Updated**: October 2026  

---

## 📌 Development Workflow & Rule of Engagement

To maintain engineering discipline and prevent feature drift, both developer and assistant adhere to these 3 rules:
1. **Always Check This File First**: Before starting any task or coding session, review this roadmap to confirm the current active priority.
2. **One Active Focus at a Time**: Keep only one milestone in `[🔄 IN PROGRESS]` to ensure high code quality and complete test coverage.
3. **Commit & Check Off**: Upon verifying code with `npm run build` and live testing, mark tasks as `[x] COMPLETED`, record the Git commit hash, and advance the roadmap.

---

## 🎯 Current Active Sprint: Phase 5 — Administrative Customer & User Management

**Goal**: Provide store administrators complete visibility over registered customers, spending habits, and account moderation.
- [ ] **Task 5.1: Admin "Customers" Data Table (`AdminCustomers.jsx`)**
  - [ ] Add 5th navigation tab to [AdminLayout.jsx](file:///d:/Study/MCA/Project/Let'sPlay/frontend/src/components/Admin/AdminLayout.jsx).
  - [ ] Searchable data table with search by Name, Email, or Mobile Number.
  - [ ] Customer Lifetime Value (LTV) metrics: Total Orders Placed and Gross Revenue Contributed.
  - [ ] Registration date and email verification status badges.
- [ ] **Task 5.2: Customer Details & Inspection Modal**
  - [ ] Modal to inspect a customer's full order history, saved addresses, and active carts.
  - [ ] Account status moderation: Toggle account active status (`Active` vs. `Suspended`).

---

## 📦 Recently Completed Sprint: Phase 4 — Customer Account Hub & Order Lifecycle

- [x] **Task 4.1: Customer Account Profile Hub (`/profile`)**
  - [x] Created `frontend/src/components/Profile/Profile.jsx` with responsive Tailwind UI.
  - [x] Account Overview Card: User Avatar with initials, Name, Email, Mobile number, Account Role badge, and Member Since date.
  - [x] Profile Edit Form: Inline modal to update Name and Mobile number with validation.
  - [x] Security Section: "Change Password" modal with current password validation and show/hide password toggles.
  - [x] Quick Metric Counters: Total Orders Placed, Wishlist Items Count, Saved Addresses Count.

- [x] **Task 4.2: Visual 4-Step Order Tracking System**
  - [x] Upgraded `OrderHistory.js` and created `OrderCard.jsx` with interactive tracking experience.
  - [x] Formatted human-readable Order Number (`LP-YYYYMMDD-XXXX`) displayed with copy/inspect clarity.
  - [x] Interactive 4-Stage Visual Progress Stepper:
    $$\text{Order Placed} \longrightarrow \text{Processing} \longrightarrow \text{Shipped} \longrightarrow \text{Delivered}$$
  - [x] Status Audit Timeline: Collapsible drawer surfacing timestamps and dispatch notes from `statusHistory`.
  - [x] Itemized purchase cards with product thumbnail, SKU, brand, quantity, and line price calculation.
  - [x] Delivery address card displaying recipient contact info and destination details.
  - [x] Formatted printable tax invoice modal with print button (`window.print()`).
  - [x] Order cancellation modal with reason selector and automated inventory restocking for pending/processing orders.

- [x] **Task 4.3: Standalone Customer Address Book Manager**
  - [x] Created `AddressManager.jsx` accessible directly from the Customer Profile.
  - [x] Card grid displaying all saved addresses with "Default" badge indicator.
  - [x] "Add New Address" modal with full address fields (House/Flat No, Street, Landmark, Pincode, District, State).
  - [x] "Edit Address" and "Delete Address" actions with confirmation prompts.
  - [x] "Set as Default Delivery Address" one-click action.

- [x] **Task 4.4: Storefront Navigation & Profile Dropdown Integration**
  - [x] Updated `Navbar.js` with a unified User Account dropdown menu when logged in.
  - [x] Links to: "My Profile & Settings", "Orders & Live Tracking", "Saved Addresses", "Admin Panel" (for admins only), and "Logout".
  - [x] Full mobile drawer compatibility with touch-friendly navigation.


---

## ⏳ Prioritized Backlog (Upcoming Milestones)

### Phase 5: Administrative Customer & User Management
**Goal**: Provide store administrators complete visibility over registered customers, spending habits, and account moderation.
- [ ] **Task 5.1: Admin "Customers" Data Table (`AdminCustomers.jsx`)**
  - [ ] Add 5th navigation tab to [AdminLayout.jsx](file:///d:/Study/MCA/Project/Let'sPlay/frontend/src/components/Admin/AdminLayout.jsx).
  - [ ] Searchable data table with search by Name, Email, or Mobile Number.
  - [ ] Customer Lifetime Value (LTV) metrics: Total Orders Placed and Gross Revenue Contributed.
  - [ ] Registration date and email verification status badges.
- [ ] **Task 5.2: Customer Details & Inspection Modal**
  - [ ] Modal to inspect a customer's full order history, saved addresses, and active carts.
  - [ ] Account status moderation: Toggle account active status (`Active` vs. `Suspended`).

### Phase 6: Checkout Stock Resilience & Payment Integration
**Goal**: Harden the checkout pipeline against concurrent stock depletion and introduce real-world payment processing.
- [ ] **Task 6.1: Checkout Stock Error Surfacing**
  - [ ] Update `Checkout.js` to catch HTTP 400 stock validation responses and display item-specific alerts (e.g. *"Product [Name] only has 1 unit remaining"*).
- [ ] **Task 6.2: Payment Gateway Sandbox Integration**
  - [ ] Integrate Razorpay / Stripe test checkout modal alongside Cash on Delivery (COD).
  - [ ] Secure server-side signature verification before transitioning order payment status to `Paid`.
- [ ] **Task 6.3: Downloadable / Printable PDF Invoice**
  - [ ] Generate clean, formatted printable tax invoice for completed orders with GST/tax breakdown, business details, and recipient address.

### Phase 7: Advanced Catalog Discovery & Search Autocomplete
**Goal**: Elevate product discovery to commercial standards.
- [ ] **Task 7.1: Live Search Autocomplete Dropdown**
  - [ ] Debounced searchbar dropdown (300ms) showing top 5 product matches with thumbnail, price, and category.
- [ ] **Task 7.2: Faceted Sidebar Filtering**
  - [ ] Interactive price range slider (₹500 to ₹10,000+).
  - [ ] Brand multi-select filter (SG, SS, Yonex, Nivia, Spalding, Stag, DGT).
  - [ ] "In-Stock Only" toggle.
  - [ ] Sorting controls: "Newest Arrivals", "Price: Low to High", "Price: High to Low", "Customer Rating".

### Phase 8: Production Security & API Hardening
**Goal**: Enterprise-grade infrastructure security and attack prevention.
- [ ] **Task 8.1: API Rate Limiting**
  - [ ] Add `express-rate-limit` on `/api/auth/login` and `/api/auth/register` (max 10 requests per 15 minutes per IP).
- [ ] **Task 8.2: HTTP Security Headers**
  - [ ] Add `helmet` middleware for Strict-Transport-Security (HSTS), XSS filter, and MIME sniffing protection.
- [ ] **Task 8.3: Password Reset Flow**
  - [ ] Implement `/api/auth/forgot-password` with signed 15-minute reset token.
  - [ ] Implement `/api/auth/reset-password/:token` for self-service password recovery.

---

## ✅ Completed Milestones & Git Log

| Milestone | Key Features Delivered | Verified Date | Git Commit |
|:---|:---|:---|:---|
| **Phase 1: Modernization & Architecture** | Migrated CRA/Bootstrap to Vite 5 + Tailwind CSS; unified monorepo runner (`npm run dev`). | Sept 2026 | `2d1f948` |
| **Phase 2: Backend Hardening & Data Integrity** | Secure SMTP env config, atomic stock deduction on checkout, ReviewController field fixes, cart resilience. | Sept 2026 | `7062017` |
| **Phase 3: Database Normalization & RBAC** | Mongoose virtual populates, direct indexing, User roles (`customer`, `admin`), `adminOnly` middleware guard. | Sept 2026 | `bd8ac7f` |
| **Phase 4: Visual Admin Panel Implementation** | Responsive Admin Dashboard (`/admin`), Metrics Overview, Product management, Order dispatching, Catalog taxonomy. | Sept 2026 | `05e95e0` |
| **Phase 5: Enterprise Enhancements** | 19 legacy orders normalized (`LP-YYYYMMDD-XXXX`), Product soft deletion (`isDeleted` / restore action), Multer direct image uploads. | Sept 2026 | `9939430` |
| **Phase 6: Database Clean-Slate Reset & Seeder** | Cleaned legacy test data, upgraded `seedData.js` to seed 2 accounts, categories, sports, equipment, products, orders, reviews, addresses, and wishlist. | Sept 2026 | `f7aa514` |
| **Phase 4: Customer Account Hub & Order Lifecycle** | Customer profile hub (`/profile`), 4-stage visual order tracking stepper, address book manager, tax invoice print modal, cancellation with inventory restocking, user dropdown menu in navbar. | Oct 2026 | `e6cf56b` |


