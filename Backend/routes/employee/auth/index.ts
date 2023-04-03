import express from 'express'
import Auth from '../../../controller/auth'

const router = express.Router()

router.post('/emp_signup', Auth.signup)
router.post('/emp_login', Auth.login)
router.post('/emp_forgetPassword', Auth.forgotPassword)
router.post('/emp_validate_recoveryCode', Auth.validateRecoveryCode)
router.post('/emp_changePassword', Auth.changePassword)

export default router
