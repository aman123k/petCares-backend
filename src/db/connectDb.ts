import mongoose from "mongoose";

const connectDb = async (DATABASE_URL: string): Promise<void> => {
  console.log(DATABASE_URL);
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("connection successful");
  } catch (err) {
    console.log("cannot connect db", err);
  }
};
export default connectDb;
