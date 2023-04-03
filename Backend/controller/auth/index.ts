import { Response, Request } from 'express'
import { logger } from '../../shared/logger'
import { PrismaClient } from '@prisma/client'
import jwt, { Secret } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { IEmp } from '../../interfaces/employee'
import { transport } from '../../shared/helper'

dotenv.config()
const prisma = new PrismaClient()

const Auth = {
  signup: async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, type, email, phone, password, organization }: IEmp = req.body
    const hashPassword = await bcrypt.hash(password, 12)
    try {
      const user = await prisma.employee.create({
        data: {
          firstName,
          lastName,
          type,
          email,
          phone,
          password: hashPassword,
          organization,
        },
      })

      const user_data = {
        id: user.id,
        firstName: user.firstName,
        type: user.type,
        organization: user.organization,
      }

      const access_token = jwt.sign(user_data, process.env.JWT_SCERET_TOKEN as Secret)

      res.status(201).send({ success: true, user: access_token })
    } catch (e: any) {
      logger.info(e)
      res.status(500).send({ error: true, message: e.message || 'Sever Error' })
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await prisma.employee.findUnique({
        where: {
          email: req.body.email,
        },
      })

      logger.info(user, req.body)

      if (user) {
        const match = await bcrypt.compare(req.body.password, user.password)

        if (match) {
          const user_data = {
            id: user.id,
            firstName: user.firstName,
            type: user.type,
            organization: user.organization,
          }

          const access_token = jwt.sign(user_data, process.env.JWT_SCERET_TOKEN as Secret)
          res.send({ success: true, access_token })
        } else {
          res.send({ error: true, message: 'Email or password did not match' })
        }
      } else {
        res.send({ error: true, message: 'Email or password did not match' })
      }
    } catch (e: any) {
      logger.info(e)
      res.status(500).send({ error: true, message: e.message || 'Sever Error' })
    }
  },

  forgotPassword: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await prisma.employee.findUnique({
        where: {
          email: req.body.email,
        },
      })

      if (user) {
        const recoveryCode = Math.round(Math.random() * 100000)

        const mailOptions = {
          from: process.env.MAIL_ID,
          to: req.body.email,
          subject: 'Account Recovery',
          text: `Your recovery code is ${recoveryCode}`,
        }

        transport.sendMail(mailOptions, async (err, info) => {
          if (err) {
            res.send(500).send({ error: true, message: err.message || 'Something went wrong' })
          } else {
            logger.info(info)
            await prisma.employee.update({
              where: {
                email: req.body.email,
              },
              data: {
                recoveryCode,
              },
            })
            res.send({ success: true, message: 'Recovery code sent on mail' })
          }
        })
      } else {
        res.send({ success: true, message: 'Could not find a user with this email' })
      }
    } catch (e: any) {
      logger.info(e)
      res.send(500).send({ error: true, message: e.message || 'Server error.' })
    }
  },

  validateRecoveryCode: async (req: Request, res: Response): Promise<void> => {
    const { email, recoveryCode } = req.body
    try {
      const user = await prisma.employee.findFirst({
        where: {
          email,
          recoveryCode,
        },
      })

      logger.info(user)

      if (user) {
        await prisma.employee.update({
          where: {
            email,
          },
          data: {
            recoveryCode: -1,
          },
        })

        res.send({ success: true })
      } else {
        res.send({ error: true, message: 'Email and recovery code not match' })
      }
    } catch (e: any) {
      logger.info(e)
      res.status(500).send({ error: true, message: e.message || 'Server Error' })
    }
  },

  changePassword: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 12)

    try {
      await prisma.employee.update({
        where: {
          email,
        },
        data: {
          password: hashedPassword,
        },
      })

      res.send({ success: true, message: 'Password changed' })
    } catch (e: any) {
      res.status(500).send({ error: true, message: e.message || 'Server error' })
    }
  },
}

export default Auth
