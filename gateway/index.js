import express from "express";
import expressProxy from "express-proxy";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use("/user", expressProxy("http://localhost:3001"));

if (process.env.SERVICE_PORT) {
  app.listen({ port: process.env.SERVICE_PORT }, () =>
    console.info(
      `🚀 Server ready at http://localhost:${process.env.SERVICE_PORT}`
    )
  );
} else {
  console.error("SERVICE_PORT needs to be set in environment variables");
}
