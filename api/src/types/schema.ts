import { z } from "zod";

export const regisSchema = z.object({
  username: z.string().min(1, { message: "username is required" }),
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email format" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const loginSchema = z.object({
  email: z.string().min(1, { message: "email or password is wrong" }).email(),
  password: z.string().min(8, { message: "email or password is Wrong" }),
});

export const PostSchema = z.object({
  title: z.string().min(1, { message: "there must be a title" }),
  description: z.string().min(1, { message: "there must be a description" }),
  imageUrl: z.string(),
});

export const editPostSchema = z.object({
  title: z.string().min(1, { message: "please add a title" }),
  description: z.string().min(1, { message: "please add a description" }),
  imageUrl: z.string().min(1).trim(),
});

export const userSchema = z.object({});
