import { Request, Response } from 'express'
import { logger } from '../../shared/logger'

const controller = {
  testFeature: async (req: Request, res: Response): Promise<void> => {
    logger.info('User Data', req.body.userData)
    res.status(200).send({ success: true })
  },
}

export default controller
