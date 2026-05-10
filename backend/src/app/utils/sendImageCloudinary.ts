/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary_name,
  api_key: config.cloudinary_api,
  api_secret: config.cloudinary_api_secret,
});

/**
 * Uploads an image to Cloudinary using a buffer (Memory Storage)
 * This is compatible with serverless environments like Vercel.
 */
export const sendImageToCloudinary = (buffer: Buffer, fileName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        public_id: fileName.split('.')[0], // Remove extension from public_id
        resource_type: 'auto' 
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

// Use memory storage instead of disk storage for Vercel compatibility
const storage = multer.memoryStorage();

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});
