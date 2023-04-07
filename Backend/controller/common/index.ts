import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { logger } from "../../shared/logger";

dotenv.config();
const prisma = new PrismaClient();

const common = {
  getJob: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).send({ error: true, message: "Invalid parameter" });
      } else {
        logger.info(">> Parameter: ", id);

        const job = await prisma.job.findUnique({
          where: {
            id,
          },
        });

        res.send({ success: true, data: job });
      }
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res.status(500).send({
        error: true,
        message: `Error getting the data from database ${e}`,
      });
    }
  },

  getUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt("0");
      console.log("req.params", req.params);
      console.log("idssss", id);
      if (isNaN(id)) {
        console.log("first");
        res.status(400).send({ error: true, message: "Invalid parameter" });
      } else {
        const allUsers = await prisma.employee.findMany();
        const user = allUsers.filter((e) => e.id !== id);

        res.send({
          success: true,
          data: user.map((e) => {
            return {
              name: e.name,
              email: e.email,
              id: e.id,
            };
          }),
        });
      }
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res.status(500).send({
        error: true,
        message: `Error getting the data from database ${e}`,
      });
    }
  },

  getSkills: async (req: Request, res: Response): Promise<void> => {
    logger.info(">> Parameter: ", req.params.keyword);

    try {
      const skills = await prisma.skills.findMany({
        where: {
          name: {
            startsWith: req.params.keyword,
            mode: "insensitive",
          },
        },
      });

      res.send({ success: true, data: skills });
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res.status(500).send({
        error: true,
        message: `Error getting the data from database ${e}`,
      });
    }
  },

  getInterviewers: async (req: Request, res: Response): Promise<void> => {
    const { offset, limit } = req.body;

    try {
      if (isNaN(offset) || isNaN(limit)) {
        throw new Error("offset and limit parameters required");
      }

      logger.info(">> Payload: ", req.body);

      const interviewers = await prisma.employee.findMany({
        skip: offset,
        take: limit,
        where: {
          empType: "INTERVIEWER",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profilePicture: true,
          empType: true,
          jobType: true,
          experience: true,
          designation: true,
        },
      });

      const parsedInterviewers = interviewers.map((interviewer) => {
        let parsedInterviewer: any = {};
        const parsedPhone = Number(interviewer.phone);
        parsedInterviewer = { ...interviewer };
        delete parsedInterviewer.phone;
        parsedInterviewer.phone = parsedPhone;
        return parsedInterviewer;
      });

      res.send({ success: true, data: parsedInterviewers });
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res.status(500).send({
        error: true,
        message: `Error getting the data from database ${e}`,
      });
    }
  },

  // eslint-disable-next-line no-unused-vars
  getTotalInterviewer: async (_req: Request, res: Response): Promise<void> => {
    try {
      const count = await prisma.employee.count({
        where: {
          empType: "INTERVIEWER",
        },
      });
      res.send({ success: true, data: count });
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res.status(500).send({
        error: true,
        message: `Error getting the data from database ${e}`,
      });
    }
  },
  allEmployee: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.body.userData.id;
      if (!id) {
        res.status(400).send({ error: `Error getting the id from database` });
      } else {
        const employee = await prisma.employee.findUnique({
          where: {
            id,
          },
          select: {
            id: true,
            name: true,
            empType: true,
            profilePicture: true,
          },
        });
        res.send({ success: true, data: employee });
      }
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res.status(500).json({
        error: true,
        message: `Error getting the data from database ${e}`,
      });
    }
  },
};

export default common;
