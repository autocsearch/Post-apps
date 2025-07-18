import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

export async function VerifyUserToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "please Login again" });
    }
    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    if (!verifiedUser) {
      return res.status(401).json({ message: "invalid or expired token" });
    }

    (req as any).user = verifiedUser;
    next();
  } catch (error) {
    next(Error);
  }
}
