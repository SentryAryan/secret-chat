import { NextRequest, NextResponse as res } from "next/server";
import { errorHandler } from "@/helpers/error-handler.helper";
import { generateApiResponse } from "@/helpers/api-response.helper";
import { getToken } from "next-auth/jwt";
import User from "@/models/user.model";
import Message from "@/models/message.model";
import { dbConnect } from "@/lib/dbConnect";

export const GET = errorHandler(async (request: NextRequest) => {
  await dbConnect();
  
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    return res.json(
      generateApiResponse(401, "Unauthorized, please login again", {}, ["Unauthorized, please login again"]),
      { status: 401 }
    );
  }

  const loggedInUser = await User.findOne({ email: token.email });

  if (!loggedInUser) {
    return res.json(
      generateApiResponse(404, "User not found", {}, ["User not found"]),
      { status: 404 }
    );
  }

  const messages = await Message.find({ receiver: loggedInUser._id });

  return res.json(
    generateApiResponse(200, "Messages fetched successfully", messages, []),
    { status: 200 }
  );
});
