import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { transport } from "../../../shared/helper";
import { logger } from "../../../shared/logger";
import { imageUpload } from "../../../services/aws-S3";

const prisma = new PrismaClient();
const singleFileUpload = imageUpload.single("profilePicture");

const Admin = {
  adminSignup: async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    try {
      const userWithEmail = await prisma.employee.findUnique({
        where: {
          email,
        },
      });

      if (userWithEmail) {
        res
          .status(400)
          .send({ error: true, message: "User exists with current email" });
      } else {
        const user = await prisma.employee.create({
          data: {
            name,
            empType: "ADMIN",
            email,
            password: hashPassword,
          },
        });

        const mailOptions = {
          from: process.env.MAIL_ID,
          to: email,
          subject: "Welcome mail!",
          text: `Hi ${name},
          Welcome to WIL-HIRE!
  
          Regards,
          WIL-Family`,
        };

        transport.sendMail(mailOptions, async (err, info) => {
          if (err) {
            logger.info({
              title: "Could not send email, Try again.",
              message: err.message,
            });
          } else {
            logger.info({ message: "Mail Sent", info: info });
          }
        });

        const user_data = {
          id: user.id,
        };

        const access_token = jwt.sign(
          user_data,
          process.env.JWT_EMP_SCERET_TOKEN as Secret
        );

        res.status(201).send({ success: true, user: access_token });
      }
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res
        .status(500)
        .send({ error: true, message: `Error from database ${e}` });
    }
  },

  createJob: async (req: Request, res: Response): Promise<void> => {
    logger.info(">> Payload: ", req.body);

    const {
      title,
      salaryRng,
      experienceRng,
      description,
      employeeId,
      type,
      city,
      department,
      opening,
    } = req.body;

    const jobReq = ["c", "database", "webdev"];
    const jobRes = ["tema leader", "verry verry good"];

    const keywords = [
      ...title.toLowerCase().split(" "),
      city.toLowerCase(),
      type[0].toLowerCase(),
      "all",
    ];

    try {
      await prisma.job.create({
        data: {
          title,
          salaryStartRng: salaryRng[0],
          salaryEndRng: salaryRng[1],
          experienceEndRng: experienceRng[1],
          experienceStartRng: experienceRng[0],
          description,
          assignedTo: employeeId,
          type,
          jobReq,
          jobRes,
          city,
          keywords,
          opening,
          department,
        },
      });

      res.status(201).send({ success: true });
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res
        .status(500)
        .send({ error: true, message: `Error from database ${e}` });
    }
  },

  addRecruiterAndInterviewer: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    logger.info("Before multer parsing>> Payload: ", req.body);
    logger.info("After multer parsing>> Files: ", req.file);

    singleFileUpload(req, res, async (err) => {
      if (err) {
        res.status(400).send({
          error: true,
          title: "Something Went Wrong",
          message: err.message,
        });
      } else {
        logger.info("After multer parsing>> Payload: ", req.body);
        logger.info("After multer parsing>> Files: ", req.file);
        logger.info(req.body);
        logger.info(req.file);

        try {
          const {
            name,
            designation,
            phone,
            email,
            jobType,
            experience,
            skills,
            empType,
          } = req.body;
          const hashPassword = await bcrypt.hash(
            Math.floor(Math.random() * 100000).toString(),
            10
          );
          let error = false;
          const parsedSkills =
            skills?.map((skill: string) => parseInt(skill)) || [];

          const userWithEmail = await prisma.employee.findUnique({
            where: {
              email,
            },
          });

          const userWithPhone = await prisma.employee.findUnique({
            where: {
              phone: parseInt(phone),
            },
          });

          if (userWithEmail || userWithPhone) {
            if (userWithEmail) {
              throw new Error("User exists with current email");
            }

            if (userWithPhone) {
              throw new Error("User exists with current phone number");
            }
          } else {
            const file: any = req.file;

            const user = await prisma.employee.create({
              data: {
                name,
                designation,
                phone: parseInt(phone),
                jobType,
                experience: parseInt(experience),
                email,
                empType,
                password: hashPassword,
                profilePicture: file.location,
                profilePicKey: file.key,
              },
            });

            parsedSkills.forEach(async (skillId: number) => {
              try {
                await prisma.employeeSkills.create({
                  data: {
                    employeeId: user.id,
                    skillId,
                  },
                });
              } catch (e: any) {
                res
                  .status(400)
                  .send({ error: true, message: `Error from database ${e}` });
                error = true;
              }
            });

            if (!error) {
              const mailOptions = {
                from: process.env.MAIL_ID,
                to: email,
                subject: "Welcome mail!",
                text: `Hi ${name},
                Welcome to WIL-HIRE!
                To Log in visit ${process.env.FRONT_END_DOMAIN} and click forgot password to change password
        
                Regards,
                WIL-Family`,
              };

              transport.sendMail(mailOptions, async (err, info) => {
                if (err) {
                  logger.info({
                    error: true,
                    title: "Could not send email, Try again.",
                    message: err.message,
                  });
                } else {
                  logger.info(info);
                }
              });
            }

            if (!error) {
              res.status(201).send({ success: true });
            } else {
              await prisma.employee.delete({
                where: {
                  id: user.id,
                },
              });
            }
          }
        } catch (e: any) {
          logger.error({ error: e, message: e.message });
          res
            .status(500)
            .send({ error: true, message: `Error from database ${e}` });
        }
      }
    });
  },

  getRecruiters: async (req: Request, res: Response): Promise<void> => {
    const { offset, limit } = req.body;

    try {
      if (isNaN(offset) || isNaN(limit)) {
        throw new Error("offset and limit parameters required");
      }

      logger.info(">> Payload: ", req.body);

      const recruiters = await prisma.employee.findMany({
        skip: offset,
        take: limit,
        where: {
          empType: {
            equals: "RECRUITER",
          },
        },
      });

      const parsedRecruiters = recruiters.map((recruiter) => {
        let parsedRecruiter: any = {};
        const parsedPhone = Number(recruiter.phone);
        parsedRecruiter = { ...recruiter };
        delete parsedRecruiter.phone;
        parsedRecruiter.phone = parsedPhone;
        return parsedRecruiter;
      });

      res.send({ success: true, data: parsedRecruiters });
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res
        .status(500)
        .send({ error: true, message: `Error from database ${e}` });
    }
  },

  getEmployeeDetails: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new Error("Invalid parameters");
      }

      logger.info(">> Parameter: ", id);

      const user: any = await prisma.employee.findUnique({
        where: {
          id,
        },
      });

      delete user.password;

      res.send({ success: true, data: user });
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res
        .status(500)
        .send({ error: true, message: `Error from database ${e}` });
    }
  },

  // eslint-disable-next-line no-unused-vars
  getCurrentJobStats: async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await prisma.job.findMany({
        select: {
          id: true,
          title: true,
          department: true,
          opening: true,
          active: true,
          contacting: true,
          archived: true,
        },
      });

      res.send({ success: true, data: stats });
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res
        .status(500)
        .send({ error: true, message: `Error from database ${e}` });
    }
  },

  searchRecruiters: async (req: Request, res: Response): Promise<void> => {
    logger.info(">> Query: ", req.query);

    try {
      const recruiters =
        req.query?.keyword === undefined
          ? await prisma.employee.findMany({
              where: {
                empType: {
                  equals: "RECRUITER",
                },
              },
              select: {
                id: true,
                name: true,
              },
            })
          : await prisma.employee.findMany({
              where: {
                empType: {
                  equals: "RECRUITER",
                },
                name: {
                  startsWith: req.query.keyword.toString(),
                  mode: "insensitive",
                },
              },
              select: {
                id: true,
                name: true,
              },
            });

      res.send({ success: true, data: recruiters });
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res
        .status(500)
        .send({ error: true, message: `Error from database ${e}` });
    }
  },

  // eslint-disable-next-line no-unused-vars
  getTotalRecruiter: async (_req: Request, res: Response): Promise<void> => {
    try {
      const count = await prisma.employee.count({
        where: {
          empType: "RECRUITER",
        },
      });
      res.send({ success: true, data: count });
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res
        .status(500)
        .send({ error: true, message: `Error from database ${e}` });
    }
  },
};

export default Admin;
