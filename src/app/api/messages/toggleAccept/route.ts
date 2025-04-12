import { NextRequest, NextResponse as res } from "next/server";
import { errorHandler } from "@/helpers/error-handler.helper";
import { generateApiResponse } from "@/helpers/api-response.helper";
import { getToken } from "next-auth/jwt";
import User from "@/models/user.model";
import { dbConnect } from "@/lib/dbConnect";

export const PATCH = errorHandler(async (request: NextRequest) => {
  await dbConnect();
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    return res.json(
      generateApiResponse(401, "Unauthorized", {}, ["Unauthorized"]),
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

  loggedInUser.isAcceptingMessages = !loggedInUser.isAcceptingMessages;
  await loggedInUser.save();

  return res.json(
    generateApiResponse(200, "Success", "Message acceptence updated", []),
    { status: 200 }
  );
});
