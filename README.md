# E-Commerce Multi-Vendor Platform

A modern, full-stack multi-vendor e-commerce platform built with Next.js, Express, and MongoDB. This project provides a robust solution for managing stores, products, orders, and payments with a seamless user experience.

## 🚀 Overview

This platform allows users to register as Buyers or Sellers. Sellers can create their own stores, list products, and manage orders. Buyers can browse products by categories or brands, add them to carts, and make secure payments via Stripe. The project also features an administrative dashboard for managing the entire ecosystem.

### Key Features

- **Multi-Vendor System**: Multiple sellers can operate independent stores.
- **Advanced Product Management**: Categorization, branding, and multi-image uploads.
- **Secure Authentication**: JWT-based auth with email verification and password recovery.
- **Real-time Notifications**: In-app notifications for order updates and system alerts.
- **Secure Payments**: Integrated Stripe payment gateway.
- **Professional UI**: Built with Next.js 16, Tailwind CSS, and Shadcn/UI for a premium look and feel.
- **Admin Dashboard**: Comprehensive stats and management tools for super-admins.
- **Seller Dashboard**: Dedicated space for sellers to track sales and manage inventory.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **State Management**: Redux Toolkit & Zustand
- **Styling**: Tailwind CSS & Shadcn/UI
- **Animations**: GSAP & Framer Motion (implicitly used in premium designs)
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: Redux Toolkit Query (likely) or custom fetch wrappers.

### Backend
- **Runtime**: Node.js / Bun
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Zod
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Multer & Cloudinary
- **Emailing**: Nodemailer

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+) or Bun
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account for image storage
- Stripe account for payments
- SMTP server (Gmail or Mailtrap) for emails

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd e-commerce
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Or using bun
   bun install
   ```
   - Create a `.env` file in the `backend` directory (refer to `.env.example`).
   - Fill in your MongoDB URI, JWT secrets, Cloudinary credentials, and SMTP details.

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   # Or using bun
   bun install
   ```
   - Create a `.env.local` file in the `frontend` directory.
   - Define `NEXT_PUBLIC_API_URL` (usually `http://localhost:5000/api/v1`).

### Running the Project

1. **Start the Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:3000` and the API at `http://localhost:5000`.

---

## 📂 Project Structure

```text
e-commerce/
├── backend/                # Express API
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/    # Domain-driven modules (User, Product, Store, etc.)
│   │   │   ├── middleware/ # Auth, validation, error handling
│   │   │   └── routes/     # API route definitions
│   │   └── server.ts       # Entry point
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # UI & Business components
│   │   ├── redux/          # Global state management
│   │   └── types/          # TypeScript interfaces
```

---

## 📖 API Documentation

# API Documentation

This document provides a comprehensive list of all API endpoints available in the E-Commerce Multi-Vendor Platform.

**Base URL**: `http://localhost:5000/api/v1`

---

## 🔐 Authentication & Authorization

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/auth/login` | `POST` | Authenticate user & get tokens | No |
| `/auth/refresh-token` | `POST` | Get a new access token using refresh token | No |
| `/auth/change-password` | `POST` | Change current user password | Yes (Any) |
| `/auth/forgot-password` | `POST` | Request password reset email | No |
| `/auth/reset-password` | `POST` | Reset password using token | No |
| `/auth/verify-email` | `GET` | Verify email via token (query string) | No |
| `/auth/resend-verification-email` | `POST` | Resend verification email | Yes (Any) |

---

## 👤 User Management

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/users/create-buyer` | `POST` | Register a new Buyer | No |
| `/users/create-seller` | `POST` | Register a new Seller | No |
| `/users/me` | `GET` | Get current user profile | Yes (Any) |
| `/users/update-profile` | `PATCH` | Update user profile details | Yes (Any) |
| `/users` | `GET` | List all users | Yes (Admin) |

---

## 🏬 Store Management

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/stores` | `POST` | Create a new store (with logo/banner) | Yes (Seller) |
| `/stores` | `GET` | Get all stores | No |
| `/stores/my-store` | `GET` | Get current seller's store | Yes (Seller) |
| `/stores/:id` | `GET` | Get single store details | No |
| `/stores/:id` | `PATCH` | Update store details | Yes (Owner/Admin) |
| `/stores/:id` | `DELETE` | Delete a store | Yes (Owner/Admin) |

---

## 📦 Product Management

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/products` | `POST` | Create a new product (multi-image) | Yes (Seller) |
| `/products` | `GET` | Get all products (with filters) | No |
| `/products/my-products` | `GET` | Get products owned by current seller | Yes (Seller) |
| `/products/:id` | `GET` | Get single product details | No |
| `/products/:id` | `PATCH` | Update product details | Yes (Owner/Admin) |
| `/products/:id` | `DELETE` | Delete a product | Yes (Owner/Admin) |

---

## 🛒 Order Management

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/orders` | `POST` | Place a new order | Yes (Buyer) |
| `/orders` | `GET` | Get all orders | Yes (Admin/Seller) |
| `/orders/my-orders` | `GET` | Get orders for current buyer | Yes (Buyer) |
| `/orders/:id` | `GET` | Get order details | Yes (Owner/Admin) |
| `/orders/:id/status` | `PATCH` | Update order status (Pending, Shipped, etc.)| Yes (Admin/Seller) |
| `/orders/:id/invoice` | `GET` | Download order invoice (PDF) | Yes (Owner/Admin) |

---

## 💳 Payments

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/payments/create-payment-intent` | `POST` | Initialize Stripe payment | Yes (Buyer) |
| `/payments/verify-payment` | `POST` | Verify Stripe payment success | Yes (Buyer) |

---

## 📂 Categories & Brands

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/categories` | `GET` | Get all categories | No |
| `/categories` | `POST` | Create a category | Yes (Admin) |
| `/brands` | `GET` | Get all brands | No |
| `/brands` | `POST` | Create a brand | Yes (Admin) |

---

## 📊 Dashboard & Stats

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/dashboard/admin-stats` | `GET` | Get system-wide statistics | Yes (Admin) |
| `/dashboard/seller-stats` | `GET` | Get store-specific statistics | Yes (Seller) |

---

## 🔔 Notifications & Other

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/notifications` | `GET` | Get user notifications | Yes (Any) |
| `/reviews` | `POST` | Submit a product review | Yes (Buyer) |
| `/withdrawals` | `POST` | Request a payout (for sellers) | Yes (Seller) |
| `/contact-info` | `GET` | Get site contact information | No |

---

## 🤝 Partners & Services

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/partners` | `GET` | List all platform partners | No |
| `/partners` | `POST` | Add a new partner | Yes (Admin) |
| `/services` | `GET` | List available services | No |
| `/services` | `POST` | Add a new service | Yes (Admin) |

---

## ✍️ Blogs & Content

| Endpoint | Method | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `/blogs` | `GET` | Get all blog posts | No |
| `/blogs/:id` | `GET` | Get single blog post | No |
| `/blogs` | `POST` | Create a new blog post | Yes (Admin) |

---

## 📝 Notes

- **Multi-part Data**: For endpoints involving file uploads (Products, Stores), use `multipart/form-data`. Wrap JSON data in a `data` field if required by the middleware.
- **Headers**: Most protected routes require `Authorization: Bearer <access_token>`.
- **Response Format**: All responses follow a standard structure:
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": { ... }
  }
  ```


## 📄 License

This project is licensed under the ISC License.
