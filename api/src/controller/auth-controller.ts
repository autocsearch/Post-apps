import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash, genSalt, compare } from "bcrypt";

const prisma = new PrismaClient();

export async function Register(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body;
    const salt = await genSalt(10);
    const hashedPass = await hash(password, salt);
    const existinguser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existinguser) {
      res.status(409).json({ message: "User already logged in" });
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPass,
      },
    });
    res.status(201).json({ message: "userCreated", data: newUser });
  } catch (error) {
    console.error(error);
  }
}

export async function Login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
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
    res.status(200).json({ message: "Logged in", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error" });
  }
}
