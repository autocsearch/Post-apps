import express from "express";
import { Register, Login, Logout } from "../controller/auth-controller";

const router = express.Router();

router.route("/register").post(Register);
router.route("/login").post(Login);
router.route("/logout").delete(Logout);
export default router;
