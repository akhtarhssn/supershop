# E-Commerce API Backend

The backend server for the E-Commerce Multi-Vendor Platform, built with Express.js and MongoDB.

## ⚙️ Features

- **Scalable Architecture**: Domain-driven module structure.
- **Security**: JWT authentication, bcrypt password hashing, and CORS protection.
- **Validation**: Strict schema validation using Zod.
- **Image Management**: Integration with Cloudinary via Multer.
- **Payments**: Stripe API integration for secure transactions.
- **Emailing**: Automated emails for verification and notifications.

## 🚀 Getting Started

### Prerequisites
- Node.js or Bun
- MongoDB Connection String
- Cloudinary Credentials
- SMTP Credentials

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the values.

3. Run in development:
   ```bash
   npm run dev
   ```

## 🛠️ Available Scripts

- `npm run dev`: Start development server with hot-reload.
- `npm run build`: Transpile TypeScript to JavaScript.
- `npm start:prod`: Run the production build.
- `npm run lint`: Check for code style issues.
- `npm run prettier`: Format code.
- `npm run seed:ecommerce`: Seed the database with sample data.

## 📖 API Documentation

For a full list of available endpoints, see the [Root API Documentation](../API_DOCUMENTATION.md).
