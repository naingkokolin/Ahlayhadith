import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MongoDB_URL as string)
    console.log(`Databse connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error while connecting database: ${error}`);
    process.exit(1);
  }
}

export default connectDB