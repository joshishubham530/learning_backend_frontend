import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
})
