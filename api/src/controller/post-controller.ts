import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { PostSchema, editPostSchema } from "../types/schema";
import { User } from "@prisma/client";

const prisma = new PrismaClient();

export async function GetPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
    });

    return res.status(200).json({ message: `this is all the post: `, data: posts });
  } catch (error) {
    console.error("Error getting post:", error);
    return next(error);
  }
}

export async function getSinglePost(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const posts = await prisma.post.findUnique({
      where: {
        id: id,
      },
      include: {
        author: true,
      },
    });

    if (!posts) {
      return res.status(404).json({ message: "post not found" });
    }

    return res.status(200).json({ message: "post found", data: posts });
  } catch (error) {
    console.error("Error getting post:", error);
    return next(error);
  }
}

export async function CreatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedData = PostSchema.parse(req.body);
    const { title, description, imageUrl } = parsedData;

    // find the user

    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const createdPost = await prisma.post.create({
      data: {
        title,
        description,
        imageUrl,
        author: {
          connect: { id: user.id },
        },
      },
    });
    return res.status(201).json({ message: "Post Created", data: createdPost });
  } catch (error) {
    console.error("Error creating post:", error);
    return next(error);
  }
}

export async function editPost(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { id } = req.params;
    const parsedData = editPostSchema.parse(req.body);
    const { title, description, imageUrl } = parsedData;

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!post) {
      return res.status(401).json({ message: "post not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "please login" });
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
    console.error("Error editing post:", error);
    return next(error);
  }
}

export async function deletePost(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "please login" });
    }

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
    console.error("Error deleting post:", error);
    return next(error);
  }
}
