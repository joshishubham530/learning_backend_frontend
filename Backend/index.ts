import dotenv from "dotenv";
import { logger } from "./shared/logger";
import createServer from "./app";
// import socket from "./sockets";

dotenv.config();
const port = process.env.PORT || 3000;

const app = createServer();

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });

  // socket();
} catch (error) {
  logger.error(`Error occured: ${(error as any).message}`);
}
