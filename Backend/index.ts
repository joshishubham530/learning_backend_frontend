import dotenv from "dotenv";
import { logger } from "./shared/logger";
import createServer from "./app";
const socketio = require("socket.io");

dotenv.config();
const port = process.env.PORT || 3000;

const app = createServer();

try {
  const server = app.listen(port, (): void => {
    logger.info(`Connected successfully on port ${port}`);
  });
  const io = socketio(server);
  io.on("connection", ({ socket }: any) => {
    console.log("New connection", socket);
  });
} catch (error) {
  logger.error(`Error occured: ${(error as any).message}`);
}
