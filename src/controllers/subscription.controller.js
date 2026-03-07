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

  const isExist = await Subscription.findOne({
    subscriber: userId,
    channel: channelId,
  });
  let subscription = null;

  if (isExist) {
    await Subscription.findByIdAndDelete(isExist._id);
  } else {
    subscription = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });
  }

  return res
    .status(200)
    .json(ApiResponse(200, subscription, "Channel Subscribed"));
});

export const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $count: "subscribers_count",
    },
  ]);

  const count = subscribers.length > 0 ? subscribers[0].subscribers_count : 0;
  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        { subscribers_count: count },
        "UserChannelSubscribers fetched successfully",
      ),
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
        channelDetail: {
          $first: "$channel",
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      ApiResponse(
        200,
        Array.isArray(subscribedChannels) ? subscribedChannels : [],
        "subscribedChannels fetched successfully",
      ),
    );
});
