import express from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const subscriptionRoute = express.Router();

subscriptionRoute.use(verifyJWT);

subscriptionRoute
  .route("/c/:channelId")
  .post(toggleSubscription)
  .get(getUserChannelSubscribers);

subscriptionRoute.route("/u/:subscriberId").get(getSubscribedChannels);
 
export default subscriptionRoute