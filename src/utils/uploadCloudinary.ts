import {CLOUDINARY_KEY, CLOUDINARY_NAME, CLOUDINARY_SECRET} from '../config'
import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET
})

export const uploadCloudinary = async(base64:string)=>{
  const respuesta = await cloudinary.uploader.upload(base64)
  return respuesta.url;
}