import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { logger } from "../../../shared/logger";
import { transport } from "../../../shared/helper";

dotenv.config();
const prisma = new PrismaClient();

const Auth = {
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await prisma.employee.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (user) {
        const match = await bcrypt.compare(req.body.password, user.password);

        if (match) {
          const user_data = {
            id: user.id,
            role: user.empType,
            name: user.name,
            email: user.email,
          };

          const access_token = jwt.sign(
            user_data,
            process.env.JWT_EMP_SCERET_TOKEN as Secret,
            { expiresIn: "30d" }
          );
          res.send({ success: true, access_token, role: user.empType });
        } else {
          res
            .status(400)
            .send({ error: true, message: "Email or password did not match" });
        }
      } else {
        res
          .status(400)
          .send({ error: true, message: "Email or password did not match" });
      }
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res
        .status(500)
        .send({ error: true, message: `Error from database ${e}` });
    }
  },

  forgotPassword: async (req: Request, res: Response): Promise<void> => {
    logger.info(">> Payload: ", req.body.email);
    console.log("req.body", req.body);

    try {
      const user = await prisma.employee.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (user) {
        const tokenData = {
          email: req.body.email,
        };
        const token = jwt.sign(
          tokenData,
          process.env.JWT_EMP_SCERET_TOKEN as Secret,
          { expiresIn: "10m" }
        );
        const mailOptions = {
          from: process.env.MAIL_ID,
          to: req.body.email,
          subject: "Account Recovery",
          text: `To reset password click ${
            process.env.FRONT_END_DOMAIN as string
          }change-password?${token} .This link is valid for only 10 mins.`,
        };

        transport.sendMail(mailOptions, async (err, info) => {
          if (err) {
            logger.info({ error: true, message: err.message });
            res.status(400).send({
              error: true,
              message: err.message || "Could not send email, Try again.",
            });
          } else {
            logger.info(info);
            res.send({ success: true, message: "Recovery code sent on mail" });
          }
        });
      } else {
        res.status(400).send({
          success: true,
          message: "Could not find a user with this email",
        });
      }
    } catch (e: any) {
      logger.error({ error: e, message: e.message });
      res
        .status(500)
        .send({ error: true, message: `Error from database ${e}` });
    }
  },

  changePassword: async (req: Request, res: Response): Promise<void> => {
    const { password, token } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    logger.info(">> Payload: ", req.body);
    jwt.verify(
      token,
      process.env.JWT_EMP_SCERET_TOKEN as Secret,
      async (err: any, data: any) => {
        try {
          if (err) {
            throw new Error("Not a valid token");
          }

          await prisma.employee.update({
            where: {
              email: data.email,
            },
            data: {
              password: hashedPassword,
            },
          });

          res.send({ success: true, message: "Password changed" });
        } catch (e: any) {
          logger.error({ error: true, message: e.message });
          res
            .status(500)
            .send({ error: true, message: `Error from database ${e}` });
        }
      }
    );
  },
  resetPassword: async (req: Request, res: Response): Promise<void> => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const email = req.body.userData.email;

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      if (!email) {
        res
          .status(400)
          .send({ error: `Error getting the email from database` });
      }

      const model = await prisma.employee.findUnique({
        where: {
          email,
        },
      });

      if (!model) {
        res.status(400).send({ error: true, message: `Email not found ` });
      } else {
        const match1 = await bcrypt.compare(oldPassword, model.password);
        if (!match1) {
          res
            .status(400)
            .send({ error: true, message: "Enter the correct old password" });
        } else {
          const match2 = await bcrypt.compare(newPassword, confirmPassword);
          if (match2) {
            res
              .status(400)
              .send({ error: true, message: "Enter the same password" });
          }

          await prisma.employee.update({
            where: {
              email,
            },
            data: {
              password: hashedPassword,
            },
          });
          res.send({ success: true, message: "Password changed" });
        }
      }
    } catch (e: any) {
      logger.error({ error: true, message: e.message });
      res
        .status(500)
        .send({ error: true, message: `Error from database ${e}` });
    }
  },
};

export default Auth;
