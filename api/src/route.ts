import express from "express";
import authRouter from "./routers/auth-route";

const app = express();
app.use(express.json());

const PORT = 8000;

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
