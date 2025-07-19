import express from "express";
import authRouter from "./routers/auth-route";
import postRoute from "./routers/post-route";
import cors from "cors";

import { VerifyUserToken } from "./middleware/post-middleware";

import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // for cookies
  })
);
const PORT = 8000;

app.use("/api/auth", authRouter);
app.use("/api/get", VerifyUserToken, postRoute);
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
