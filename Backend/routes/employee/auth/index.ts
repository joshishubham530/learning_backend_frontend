import express from 'express'
import Auth from '../../../controller/employee/auth'
import { authToken } from '../../../middleware/index'

const router = express.Router()

router.post('/emp-login', Auth.login)
router.post('/emp-forget-password', Auth.forgotPassword)
router.post('/emp-change-password', Auth.changePassword)
router.put('/emp-reset-password', authToken, Auth.resetPassword)

export default router
