import express from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const subscriptionRoute = express.Router();

subscriptionRoute.use(verifyJWT);

subscriptionRoute
  .route("/:channelId")
  .post(toggleSubscription)
  .get(getUserChannelSubscribers);

subscriptionRoute.route("/").get(getSubscribedChannels);
 
export default subscriptionRoute