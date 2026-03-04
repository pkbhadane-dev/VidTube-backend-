import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { Subscription } from "../models/subscription.model";
import { ApiResponse } from "../utils/ApiResponse";

export const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userId = req.user?._id;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }
  if (userId.toString() === channelId.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel.");
  }

  const existing = await Subscription.findOne({ subscriber: userId, channel: channelId });
  let message = "Subscribed to channel";
  let result;
  if (existing) {
    await Subscription.deleteOne({ _id: existing._id });
    message = "Unsubscribed from channel";
    result = null;
  } else {
    result = await Subscription.create({ subscriber: userId, channel: channelId });
  }

  return res.status(200).json(ApiResponse(200, result, message));
});

export const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  const count = await Subscription.countDocuments({ channel: channelId });

  return res.status(200).json(
    ApiResponse(200, { subscribers_count: count }, "UserChannelSubscribers fetched successfully")
  );
});

export const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriberId");
  }

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        channelDetail: { $first: "$channel" },
      },
    },
    {
      $project: {
        channelDetail: 1,
        _id: 0,
      },
    },
  ]);

  return res.status(200).json(
    ApiResponse(200, subscribedChannels, "subscribedChannels fetched successfully")
  );
});
