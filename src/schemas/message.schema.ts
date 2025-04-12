import { z } from "zod";

export const messageSchema = z.object({
  id: z.string().min(1, "Id is required"),
  content: z
    .string()
    .min(10, "message must be at least 10 characters long")
    .max(300, "message must be less than or equal to 300 characters"),
});
