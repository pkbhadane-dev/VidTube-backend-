import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getChannelStats } from "../controllers/dashboard.controller.js";

const dashboardRoute = express.Router();

dashboardRoute.use(verifyJWT);

dashboardRoute.route("/stats").get(getChannelStats);

export default dashboardRoute