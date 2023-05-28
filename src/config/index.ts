import {config} from 'dotenv';

if(process.env.NODE_ENV !== 'production'){
  config();
}

export const PORT = process.env.PORT || 5001;
export const MONGO_URI = process.env.MONGO_URI;
export const SECRET = process.env.SECRET;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
export const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
export const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
export const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;