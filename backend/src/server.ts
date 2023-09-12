import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routers/auth";
import pollsRouter from "./routers/polls";
import usersRouter from "./routers/users";

const app = express();

app.use(cors({ origin:[ "http://localhost:3000", "http://localhost:3001"], credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use(express.static("images"));
app.use("/auth", authRouter);
app.use("/polls", pollsRouter);
app.use("/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
  console.log(req.cookies);
  res.status(404).send("no link matched!");
});

export default app;
