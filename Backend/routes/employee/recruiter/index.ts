import express from 'express'
import recruiter from '../../../controller/employee/recruiter'
import { authToken, recruiterRole } from '../../../middleware'

const router = express.Router()

router.post('/candidate', authToken, recruiterRole, recruiter.addCandidate)
router.post('/interview', authToken, recruiterRole, recruiter.setInterview)
router.patch('/candidate-stage', authToken, recruiterRole, recruiter.changeCandidateStage)

export default router
