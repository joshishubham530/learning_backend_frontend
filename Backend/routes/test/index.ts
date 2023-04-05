import express from 'express'
import testController from '../../controller/test'
import { authToken } from '../../middleware'

const router = express.Router()

router.get('/test-feature', authToken, testController.testFeature)

export default router
