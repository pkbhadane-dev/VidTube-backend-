import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getChannelStats } from "../controllers/dashboard.controller";

const dashboardRoute = express.Router();

dashboardRoute.use(verifyJWT);

dashboardRoute.route("/stats").get(getChannelStats);

export default dashboardRoute