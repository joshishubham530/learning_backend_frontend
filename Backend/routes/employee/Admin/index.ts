import express from 'express'
import admin from './../../../controller/employee/admin'
import { authToken, adminRole } from '../../../middleware'

const router = express.Router()

router.post('/signup', admin.adminSignup)
router.post('/create-job', authToken, adminRole, admin.createJob)
router.post('/add-employee', authToken, adminRole, admin.addRecruiterAndInterviewer)
router.post('/get-recruiters', authToken, adminRole, admin.getRecruiters)
router.get('/employee-details/:id', authToken, adminRole, admin.getEmployeeDetails)
router.get('/get-jobs-stats', authToken, adminRole, admin.getCurrentJobStats)
router.get('/search-recruiters', authToken, adminRole, admin.searchRecruiters)
router.get('/recruiter-count', authToken, adminRole, admin.getTotalRecruiter)

export default router
