import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash, genSalt, compare } from "bcrypt";
import { login, regis } from "../types";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function Register(req: Request, res: Response) {
  try {
    const parsedData = regis.parse(req.body);
    const { username, email, password } = parsedData;
    const salt = await genSalt(10);
    const hashedPass = await hash(password, salt);
    const existinguser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existinguser) {
      return res.status(409).json({ message: "User already logged in" });
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPass,
      },
    });

    const jwtPayloads = { id: newUser.id };
    const token = jwt.sign(jwtPayloads, process.env.JWT_SECRET_KEY as string, { expiresIn: "15m" });
    await prisma.token.create({
      data: {
        token,
        userId: newUser.id,
        expiredAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(201).json({ message: "userCreated", data: newUser });
  } catch (error) {
    console.error(error);
  }
}

export async function Login(req: Request, res: Response) {
  try {
    const rawData = login.parse(req.body);
    const { email, password } = rawData;
    if (!email || !password) {
      return res.status(404).json({ message: "user not found" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "email or password is not logged in yet" });
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "email or password is Incorrect" });
    }

    const jwtPayload = { id: user.id };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY as string, { expiresIn: "15m" });

    // store the token in prisma
    // Reason: to protect user copy the last token after they logged out
    await prisma.token.create({
      data: {
        token,
        userId: user.id,
        expiredAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({ message: "Logged in", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
}

export async function Logout(req: Request, res: Response) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "no token provided" });
    }

    await prisma.token.deleteMany({
      where: {
        token,
      },
    });

    res.clearCookie("token");
    res.status(200).json({ message: "You are successfully logged out" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
}
