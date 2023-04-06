import express from "express";
import { Response, Request } from "express";
const app = express();
const http = require("http");
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server);

export const Chat = async (req: Request, res: Response): Promise<void> => {
  try {
    io.on("connection", ({ socket }: any) => {
      console.log("a user connected", socket);
    });
    res.send({ message: "Invalid parameter" });
  } catch (e) {
    console.log("e", e);
  }
  console.log("req", req.body);
};
