import Ride from "../models/rideModel.js";
import { subscribeToQueue, publishToQueue } from "../service/rabbit.js";

export const createRide = async (req, res) => {
  const { pickup, destination } = req.body;

  const newRide = new Ride({
    user: req.user._id,
    pickup,
    destination,
  });

  await newRide.save();
  publishToQueue("new-ride", JSON.stringify(newRide));
  res.send(newRide);
};

export const acceptRide = async (req, res) => {
  const { rideId } = req.query;
  const ride = await rideModel.findById(rideId);
  if (!ride) {
    return res.status(404).json({ message: "Ride not found" });
  }

  ride.status = "accepted";
  await ride.save();
  publishToQueue("ride-accepted", JSON.stringify(ride));
  res.send(ride);
};
