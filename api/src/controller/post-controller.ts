import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GetPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
    });

    return res.status(201).json({ message: `this is all the post: `, data: posts });
  } catch (error) {
    return next(error);
  }
}

export async function CreatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, imageUrl } = req.body;

    // find the user

    const user = (req as any).user;

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const CreatePost = await prisma.post.create({
      data: {
        title,
        description,
        imageUrl,
        author: {
          connect: { id: user.id },
        },
      },
    });
    return res.status(201).json({ message: "Post Created", data: CreatePost });
  } catch (error) {
    return next(error);
  }
}

export async function editPost(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { title, description, imageUrl } = req.body;

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      return res.status(401).json({ message: "post not found" });
    }

    if (post.authorid !== user.id) {
      return res.status(403).json({ message: "you are not allowd to edit this post" });
    }

    await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        title,
        description,
        imageUrl,
      },
    });

    return res.status(200).json({ message: "post updated" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    if (post.authorid !== user.id) {
      return res.status(403).json({ message: "you are not allowed to delete this post" });
    }

    await prisma.post.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({ message: "post deleted" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
}
