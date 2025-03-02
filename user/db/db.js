import mongoose from "mongoose";

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
