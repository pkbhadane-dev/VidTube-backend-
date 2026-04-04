import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const dashboardRoute = express.Router();

dashboardRoute.use(verifyJWT);

dashboardRoute.route("/stats").get(getChannelStats);
dashboardRoute.route("/user-videos/:username").get(getChannelVideos)

export default dashboardRoute