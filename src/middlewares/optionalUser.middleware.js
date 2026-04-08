import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getOptionalUser = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
console.log("token", token);

    if (!token) {
      req.user = null;
      console.log("user", req.user);
      return next();
    }


    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    ((req.token = null), next());
  }
});
