import express from "express";
import { GetPosts, CreatePost, editPost, getSinglePost, deletePost } from "../controller/post-controller";

const router = express.Router();

router.route("/post").get(GetPosts);
router.route("/create").post(CreatePost);
router.route("/edit").put(editPost);
router.route("/delete/:id").delete(deletePost);
router.route("/:id").get(getSinglePost);

export default router;
