import mongoose from "mongoose"
import dotenv from 'dotenv';
dotenv.config();
const MONGODB_URL = process.env.MONGODB_URL;



async function connectToDB() {
  try {
    if (!MONGODB_URL) {
    throw new Error('MONGODB_URL is missing');
    }
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB successfully!");
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw  error;
  }
}   

export  {connectToDB} 

