import { Response, Request } from "express";
import jwt from "jsonwebtoken";

export async function VerifyUserToken(res: Response, req: Request) {
  try {
    const token = req.cookies.token;
  } catch (error) {}
}
