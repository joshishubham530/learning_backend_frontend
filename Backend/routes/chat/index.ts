import express from "express";
import { Chat } from "../../controller/chat/index";

const router = express.Router();

router.get("/chat", Chat);

export default router;
