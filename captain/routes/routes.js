import express from "express";
import {
  login,
  logout,
  register,
  profile,
  acceptedRides,
} from "../controllers/userController.js";
import { captainAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", captainController.register);
router.post("/login", captainController.login);
router.get("/logout", captainController.logout);
router.get("/profile", captainAuth, captainController.profile);
router.patch(
  "/toggle-availability",
  captainAuth,
  captainController.toggleAvailability
);
router.get(
  "/new-ride",
  captainAuth,
  captainController.waitForNewRide
);

export default router;
