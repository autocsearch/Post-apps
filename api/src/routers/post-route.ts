import express from "express";
import { GetPosts, CreatePost, editPost } from "../controller/post-controller";

const router = express.Router();

router.route("/post").get(GetPosts);
router.route("/create").post(CreatePost);
router.route("/edit").put(editPost);

export default router;
