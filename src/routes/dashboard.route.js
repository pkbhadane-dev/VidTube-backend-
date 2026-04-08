import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
import { getOptionalUser } from "../middlewares/optionalUser.middleware.js";

const dashboardRoute = express.Router();

dashboardRoute.route("/stats").get(verifyJWT,getChannelStats);
dashboardRoute.route("/user-videos/:username").get(getOptionalUser, getChannelVideos)

export default dashboardRoute