import { Request, Response, NextFunction } from 'express'
import jwt, { Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { logger } from '../shared/logger'

dotenv.config()

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(403).send({ msg: 'Token not provided' })
  }

  const [authType, token] = authorization.split(' ')
  if (authType !== 'Bearer') {
    return res.status(403).send({ error: true, message: 'Token not provided' })
  }

  if (!token) {
    return res.status(403).send({ error: true, message: 'Token not provided' })
  }

  jwt.verify(token, process.env.JWT_SCERET_TOKEN as Secret, (err, emp) => {
    logger.info(err)
    if (err) return res.status(403)

    logger.info(emp)
    next()
    return
  })
  return res.status(400).send({ error: true, message: 'Token not verified' })
}
