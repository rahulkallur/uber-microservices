import express from "express";
import { createRide, acceptRide } from "../controller/rideController.js";
import { captainAuth, userAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-ride", userAuth, createRide);
router.put("/accept-ride", captainAuth, acceptRide);

export default router;
