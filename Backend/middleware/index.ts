import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const authToken = (req: Request, res: Response, next: NextFunction): any => {
  const authorization = req.headers?.authorization

  if (!authorization) {
    return res.status(403).send({ error: true, message: 'Token not provided' })
  }

  const [authType, token] = authorization.split(' ')
  if (authType !== 'Bearer') {
    return res.status(403).send({ error: true, message: 'Token not provided' })
  }

  if (!token) {
    return res.status(403).send({ error: true, message: 'Token not provided' })
  }

  jwt.verify(token, process.env.JWT_EMP_SCERET_TOKEN as Secret, (err, data) => {
    if (err) return res.status(403)

    req.body.userData = data

    next()
    return
  })
}

export const adminRole = (req: Request, res: Response, next: NextFunction): any => {
  if (req.body.userData.role !== 'ADMIN') {
    return res.status(403).send({ error: true, message: 'unauthorized' })
  }

  next()
}

export const recruiterRole = (req: Request, res: Response, next: NextFunction): any => {
  if (req.body.userData.role !== 'RECRUITER') {
    return res.status(403).send({ error: true, message: 'unauthorized' })
  }

  next()
}

export const interviewerRole = (req: Request, res: Response, next: NextFunction): any => {
  if (req.body.userData.role !== 'INTERVIEWER') {
    return res.status(403).send({ error: true, message: 'unauthorized' })
  }

  next()
}

export const adminAndRecruiterRole = (req: Request, res: Response, next: NextFunction): any => {
  if (req.body.userData.role !== 'RECRUITER' && req.body.userData.role !== 'ADMIN') {
    return res.status(403).send({ error: true, message: 'unauthorized' })
  }

  next()
}
