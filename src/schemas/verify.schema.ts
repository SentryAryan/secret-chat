import { z } from "zod";

export const verifySchema = z.object({
  verifyToken: z
    .string()
    .min(6, "verify token must be at least 6 characters long"),
});
