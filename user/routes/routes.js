import express from "express";
import {
  login,
  logout,
  register,
  profile,
  acceptedRides,
} from "../controllers/userController.js";
import { userAuth } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", userAuth, logout);
router.get("/profile", userAuth, profile);
router.get("/accepted-rides", userAuth, acceptedRides);

export default router;
