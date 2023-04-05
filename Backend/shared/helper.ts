import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { logger } from './logger'

dotenv.config()
const prisma = new PrismaClient()

export const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASSWORD,
  },
})

export const updateActiveStageOfCandidate = async (id: number): Promise<void> => {
  await prisma.job.update({
    where: {
      id,
    },
    data: {
      active: {
        increment: 1,
      },
    },
  })

  logger.info('No of active candidates incremented')
}

export const updateContactingStageOfCandidate = async (id: number, preOnboarding: string): Promise<void> => {
  if (preOnboarding === 'HIRED') {
    throw new Error('To set pre onboarding as HIRED, also set stage as HIRED')
  }

  await prisma.job.update({
    where: {
      id,
    },
    data: {
      contacting: {
        increment: 1,
      },
      active: {
        decrement: 1,
      },
    },
  })

  logger.info('No of contacting candidate incremented')
}

export const updateArchivedStageOfCandidate = async (id: number, currentStage: string): Promise<void> => {
  if (currentStage == undefined) {
    throw new Error('currentStage field required to archive a candidate')
  }

  if (currentStage == 'PRE ONBOARDING') {
    await prisma.job.update({
      where: {
        id,
      },
      data: {
        contacting: {
          decrement: 1,
        },
        archived: {
          increment: 1,
        },
      },
    })

    logger.info('No of archive updated: From Pre Onboarding')
  } else {
    await prisma.job.update({
      where: {
        id,
      },
      data: {
        active: {
          decrement: 1,
        },
        archived: {
          increment: 1,
        },
      },
    })

    logger.info('No of archive updated: From Active')
  }
}

export const updateHiredStageOfCandidate = async (id: number, preOnboarding: string): Promise<void> => {
  if (preOnboarding !== 'HIRED') {
    throw new Error('To set status as HIRED, pre onboarding status should be HIRED')
  }

  await prisma.job.update({
    where: {
      id,
    },
    data: {
      contacting: {
        decrement: 1,
      },
      filled: {
        increment: 1,
      },
    },
  })
}
