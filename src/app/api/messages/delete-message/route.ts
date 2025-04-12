import { NextRequest, NextResponse as res } from "next/server";
import { errorHandler } from "@/helpers/error-handler.helper";
import { generateApiResponse } from "@/helpers/api-response.helper";
import { getToken } from "next-auth/jwt";
import User from "@/models/user.model";
import Message from "@/models/message.model";
import { dbConnect } from "@/lib/dbConnect";

export const DELETE = errorHandler(async (request: NextRequest) => {
  await dbConnect();
  
  const token = await getToken({ req: request });
  if (!token) {
    return res.json(
      generateApiResponse(401, "Unauthorized, please login again", {}, [
        "Unauthorized, please login again",
      ]),
      { status: 401 }
    );
  }
  
  const { id, messageId } = await request.json();
  const receiverUser = await User.findById(id);

  if (!receiverUser) {
    return res.json(
      generateApiResponse(404, "User not found", {}, ["User not found"]),
      { status: 404 }
    );
  }

  const message = await Message.findByIdAndDelete(messageId);

  if (!message) {
    return res.json(
      generateApiResponse(404, "Message not found", {}, ["Message not found"]),
      { status: 404 }
    );
  }

  return res.json(
    generateApiResponse(200, "Message deleted successfully", {}, []),
    { status: 200 }
  );
});
