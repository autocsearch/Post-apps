import express from "express";
import authRouter from "./routers/auth-route";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 8000;

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
