import express, { Application } from "express";
import empAuthRoutes from "./routes/employee/auth";
import adminRoutes from "./routes/employee/Admin";
import commonRoutes from "./routes/common";
import testRoutes from "./routes/test";
import recruiterRoutes from "./routes/employee/recruiter";
import Chat from "./routes/chat";
const app: Application = express();

const createServer = () => {
  var cors = require("cors");

  // Body parsing Middleware

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(empAuthRoutes);
  app.use(adminRoutes);
  app.use(commonRoutes);
  app.use(recruiterRoutes);
  app.use(Chat);
  app.use("/test", testRoutes);

  return app;
};

export default createServer;
