import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const { MONGODB_URL } = process.env;

export const connect = () => {
  if (!MONGODB_URL) {
    console.error("MONGODB_URL is missing in environment variables");
    process.exit(1);
  }

  mongoose
    .connect(MONGODB_URL)
    .then(() => console.log(`DB Connection Success`))
    .catch((err) => {
      console.log(`DB Connection Failed`);
      console.log(err);
      process.exit(1);
    });
};
