import mongoose from "mongoose";

const connectDb = async (DATABASE_URL: string): Promise<void> => {
  console.log(DATABASE_URL);
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("connection successfull");
  } catch (err) {
    console.log("connot connect db", err);
  }
};
export default connectDb;
