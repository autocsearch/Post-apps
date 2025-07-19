import * as z from "zod";

export const ResgisterSchema = z.object({
  username: z.string().min(1, { message: "must be at least 8 characters long" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const loginSchema = z.object({
  email: z.string().min(1, { message: "email or password is wrong" }).email(),
  password: z.string().min(8, { message: "email or password is Wrong" }),
});
