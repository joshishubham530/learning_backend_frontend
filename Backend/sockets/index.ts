import express, { Application } from "express";
const http = require("http");
const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const socket = () => {
  const io: any = new Server(server);

  io.on("connection", (socket: any) => {
    console.log("first");
    console.log("connected with " + "id " + socket.id, socket.id);
    socket.on("chat message", (msg: string) => {
      console.log("socketssss.id", socket.id);

      socket.emit("chat message", `${msg} with socket id ${socket.id}`);
    });

    // socket.on("disconnect", function () {
    //   console.log("A user disconnected");
    // });
  });
  return io;
};

export default socket;
