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
