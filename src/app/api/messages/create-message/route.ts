import { NextRequest, NextResponse as res } from "next/server";
import { errorHandler } from "@/helpers/error-handler.helper";
import { generateApiResponse } from "@/helpers/api-response.helper";
import { getToken } from "next-auth/jwt";
import User from "@/models/user.model";
import Message from "@/models/message.model";
import { messageSchema } from "@/schemas/message.schema";
import { z } from "zod";
import { dbConnect } from "@/lib/dbConnect";

export const POST = errorHandler(async (request: NextRequest) => {
  await dbConnect();

  const { id, content }: z.infer<typeof messageSchema> = await request.json();
  const receiverUser = await User.findById(id);

  if (!receiverUser) {
    return res.json(
      generateApiResponse(404, "User not found", {}, ["User not found"]),
      { status: 404 }
    );
  }

  if (receiverUser.isAcceptingMessages === false) {
    return res.json(
      generateApiResponse(400, "User is not accepting messages", {}, [
        "User is not accepting messages",
      ]),
      { status: 400 }
    );
  }
  const message = await Message.create({
    content,
    receiver: receiverUser._id,
  });

  return res.json(
    generateApiResponse(200, "Message sent successfully", { message }, []),
    { status: 200 }
  );
});
