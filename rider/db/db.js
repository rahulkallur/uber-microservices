import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log(process.env.MONGO_URL);

export const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("User service connected to MongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
};
