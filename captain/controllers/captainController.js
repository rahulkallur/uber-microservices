import Captain from "../models/captainModel.js";
import jwt from "jsonwebtoken";
import blacklistTokenModel from "../models/blacklistTokenModel.js";
import bcrypt from "bcrypt";
import { subscribeToQueue } from "../service/rabbit.js";

const pendingRequests = [];

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const captain = await Captain.findOne({ email });

    if (captain) {
      return res.status(400).json({ message: "captain already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newcaptain = new Captain({ name, email, password: hash });

    await newcaptain.save();

    const token = jwt.sign({ id: newcaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token);

    delete newcaptain._doc.password;

    res.send({ token, newcaptain });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const captain = await Captain.findOne({ email }).select("+password");

    if (!captain) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, captain.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    delete captain._doc.password;

    res.cookie("token", token);

    res.send({ token, captain });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    await blacklistTokenModel.create({ token });
    res.clearCookie("token");
    res.send({ message: "captain logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.send(req.captain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const captain = await Captain.findById(req.captain._id);
    captain.isAvailable = !captain.isAvailable;
    await captain.save();
    res.send(captain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const waitForNewRide = async (req, res) => {
  // Set timeout for long polling (e.g., 30 seconds)
  req.setTimeout(30000, () => {
    res.status(204).end(); // No Content
  });

  // Add the response object to the pendingRequests array
  pendingRequests.push(res);
};

// Subscribe to the "newRide" queue
subscribeToQueue("newRide", (message) => {
  const rideData = JSON.parse(message);
  // Notify all pending clients
  pendingRequests.forEach((res) => {
    res.send(rideData);
  });
  // Clear the pendingRequests array
  pendingRequests.length = 0;
});
