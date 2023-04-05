import { Response, Request } from 'express'
import { PrismaClient } from '@prisma/client'
import { multiUpload } from '../../../services/aws-S3'
import { logger } from '../../../shared/logger'
import {
  updateActiveStageOfCandidate,
  updateArchivedStageOfCandidate,
  updateContactingStageOfCandidate,
  updateHiredStageOfCandidate,
} from '../../../shared/helper'

const prisma = new PrismaClient()
const multipleFileUpload = multiUpload.fields([
  { name: 'docs', maxCount: 1 },
  { name: 'image', maxCount: 1 },
])

const recruiter = {
  addCandidate: async (req: Request, res: Response): Promise<void> => {
    logger.info('Before multer parsing>> Payload: ', req.body)
    logger.info('After multer parsing>> Files: ', req.files)

    multipleFileUpload(req, res, async (err) => {
      if (err) {
        res.status(400).send({ error: true, title: 'Something Went Wrong', message: err.message })
      } else {
        logger.info('After multer parsing>> Payload: ', req.body)
        logger.info('After multer parsing>> Files: ', req.files)

        const {
          name,
          email,
          phone,
          city,
          country,
          skills,
          stage,
          source,
          currJobTitle,
          qualification,
          expectedSalary,
          expectedSalaryUnit,
          currentSalary,
          currentSalaryUnit,
          experience,
          socials,
          jobId,
          info,
          website,
        } = req.body

        const files: any = req.files
        const image = files.image
        const docs = files.docs
        let error = false

        try {
          const userWithEmail = await prisma.candidate.findUnique({
            where: {
              email,
            },
          })

          const userWithPhone = await prisma.candidate.findUnique({
            where: {
              phone: parseInt(phone),
            },
          })

          if (userWithEmail || userWithPhone) {
            if (userWithEmail) {
              throw new Error('User exists with current email')
            }

            if (userWithPhone) {
              throw new Error('User exists with current phone number')
            }
          }

          const user = await prisma.candidate.create({
            data: {
              name,
              email,
              phone: parseInt(phone),
              city,
              country,
              source,
              currJobTitle,
              qualification,
              expectedSalary: parseInt(expectedSalary),
              expectedSalaryUnit,
              currentSalary: parseInt(currentSalary),
              currentSalaryUnit,
              experience: parseInt(experience),
              profilePicture: image[0].location,
              profilePicKey: image[0].key,
              resume: docs[0].location,
              resumeKey: docs[0].key,
              info: info != null ? info : undefined,
              website: website != null ? website : undefined,
            },
          })

          const parsedSocial = socials?.map((social: string) => JSON.parse(social)) || []
          parsedSocial.forEach(async (social: any) => {
            try {
              await prisma.candidateSocial.create({
                data: {
                  name: social.name,
                  url: social.url,
                  candidateId: user.id,
                },
              })
            } catch (e: any) {
              res.status(500).send({ error: true, message: `Error from database ${e}` })
              error = true
            }
          })

          if (!error) {
            const parsedSkills = skills?.map((skill: string) => parseInt(skill)) || []
            parsedSkills.forEach(async (skillId: number) => {
              try {
                await prisma.candidateSkills.create({
                  data: {
                    candidateId: user.id,
                    skillId,
                    value: 0,
                  },
                })
              } catch (e: any) {
                error = true
                res.status(400).send({ error: true, message: e.message })
              }
            })
          }

          if (!error) {
            await prisma.candidateForJobs.create({
              data: {
                jobId: parseInt(jobId),
                candidateId: user.id,
                stage,
              },
            })

            res.send({ success: true })
          } else {
            await prisma.candidate.delete({
              where: {
                id: user.id,
              },
            })
          }
        } catch (e: any) {
          logger.error({ error: e, message: e.message })
          res.status(400).send({ error: true, message: e.message })
        }
      }
    })
  },

  setInterview: async (req: Request, res: Response): Promise<void> => {
    const { title, interviewerId, candidateId, date, time, url } = req.body
    logger.info('>> Payload: ', req.body)

    try {
      await prisma.interviewRound.create({
        data: {
          title,
          interviewerId,
          candidateId,
          date: new Date(date),
          startTime: new Date(time[0]),
          endTime: new Date(time[1]),
          url,
        },
      })

      res.status(201).send({ success: true, message: 'Interview scheduled' })
    } catch (e: any) {
      logger.error({ error: e, message: e.message })
      res.status(500).send({ error: true, message: `Error from database ${e}` })
    }
  },

  changeCandidateStage: async (req: Request, res: Response): Promise<void> => {
    logger.info('>> Payload :', req.body)

    const { jobId, candidateId, stage, preOnboarding, currentStage } = req.body
    const stages = ['SOURCED', 'SCREENING', 'TECHNICAL ROUND', 'MANAGER', 'HR ROUND', 'PRE ONBOARDING', 'HIRED']
    const preOnboardingStages = [
      'START',
      'COLLECT INFO',
      'VERIFY INFO',
      'RELEASE OFFER',
      'OFFER ACCEPT',
      'HIRED',
      undefined,
    ]

    try {
      if (!stages.includes(stage)) {
        throw new Error('Not a valid stage')
      }

      if (!preOnboardingStages.includes(preOnboarding)) {
        throw new Error('Not a valid preOnboarding stage')
      }

      logger.info('>> Payload :')
      logger.info(req.body)

      switch (stage) {
        case 'SCREENING':
          await updateActiveStageOfCandidate(jobId)
          break
        case 'ARCHIVED':
          await updateArchivedStageOfCandidate(jobId, currentStage)
          break
        case 'PRE ONBOARDING':
          await updateContactingStageOfCandidate(jobId, preOnboarding)
          break
        case 'HIRED':
          await updateHiredStageOfCandidate(jobId, preOnboarding)
          break
        default:
          throw new Error('Invalid stage value')
      }

      await prisma.candidateForJobs.update({
        where: {
          candidateId_jobId: {
            candidateId,
            jobId,
          },
        },
        data: {
          stage,
          preOnboarding: preOnboarding != null ? preOnboarding : undefined,
        },
      })

      res.send({ success: true })
    } catch (e: any) {
      logger.error({ error: e, message: e.message })
      res.status(500).send({ error: true, message: `Error from database ${e}` })
    }
  },
}

export default recruiter
