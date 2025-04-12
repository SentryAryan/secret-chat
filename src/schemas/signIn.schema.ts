import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("invalid email address"),
  password: z
    .string()
    .min(8, "password must be at least 8 characters long")
    .refine((password) => {
      const uppercaseRegex = /[A-Z]/;
      const lowercaseRegex = /[a-z]/;
      const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

      if (!uppercaseRegex.test(password)) return false;
      if (!lowercaseRegex.test(password)) return false;
      if (!specialCharRegex.test(password)) return false;

      return true;
    }, "Password must contain at least one uppercase letter, one lowercase letter, and one special character"),
});
