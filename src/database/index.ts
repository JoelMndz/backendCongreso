import mongoose from "mongoose";

import {MONGO_URI} from "../config";

export const conectarMongoDB = async()=>{
  try {
    await mongoose.connect(MONGO_URI!)
    console.log('MongoDB contectado!');    
  } catch (error) {
    console.log(error);
    throw new Error('Error de conexion, '+error)
  }
}