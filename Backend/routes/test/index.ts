import express from 'express'
import testController from '../../controller/test'
import auth from '../../controller/auth'
import { authenticateToken } from '../../middleware'

const router = express.Router()

router.get('/test-feature', authenticateToken, testController.testFeature)
router.post('/signup', auth.signup)
router.post('/login')

export default router
