import express from "express";
import common from "../../controller/common";
import { authToken, adminAndRecruiterRole } from "../../middleware";

const router = express.Router();

router.get("/job/:id", authToken, common.getJob);
router.get("/user", common.getUser);
router.get("/skills/:keyword", common.getSkills);
router.post(
  "/get-interviewers",
  authToken,
  adminAndRecruiterRole,
  common.getInterviewers
);
router.get("/interviewer-count", authToken, common.getTotalInterviewer);
router.get("/get-employee", authToken, common.allEmployee);

export default router;
