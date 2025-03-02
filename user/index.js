import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.disable("x-powered-by");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

if (process.env.SERVICE_PORT) {
  app.listen({ port: process.env.SERVICE_PORT }, () =>
    console.info(
      `🚀 Server ready at http://localhost:${process.env.SERVICE_PORT}`
    )
  );
} else {
  console.error("SERVICE_PORT needs to be set in environment variables");
}
