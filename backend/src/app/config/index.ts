import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  frontend_url: process.env.FRONTEND_URL,
  database_URL: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires: process.env.JWT_REFRESH_EXPIRES_IN,
  smtp_pass: process.env.SMTP_PASS,
  mail_sender: process.env.MAIL_SENDER,
  company_email: process.env.COMPANY_EMAIL,
  cloudinary_name: process.env.CLOUDINARY_NAME,
  cloudinary_api: process.env.CLOUDINARY_API,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
};
