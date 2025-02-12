import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/PostSocketIO");
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Error:");
    process.exit(1);
  }
};

export default connectDB;
