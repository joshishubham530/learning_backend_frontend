/* eslint-disable no-unused-vars */
import multer from 'multer'
import multerS3 from 'multer-s3'
import aws from 'aws-sdk'
import path from 'path'
import { logger } from '../shared/logger'

const s3 = new aws.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
})

const storage = multerS3({
  s3: s3,
  bucket: 'wil-hire-uploads-dev',
  acl: 'public-read',
  metadata: function (_req, file, cb) {
    cb(null, { fieldName: file.originalname })
  },
  key: function (_req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`)
  },
})

export const imageUpload = multer({
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/tiff' ||
      file.mimetype === 'image/jpg'
    ) {
      return cb(null, true)
    }

    cb(new Error('Invalid file type!'))
  },
  storage,
})

export const pdfUpload = multer({
  fileFilter: (_req, file, cb) => {
    if (path.extname(file.originalname) !== '.pdf') {
      return cb(new Error('Only pdfs are allowed'))
    }

    cb(null, true)
  },
  storage,
})

export const multiUpload = multer({
  fileFilter: (_req, file, cb) => {
    const fileFormat = ['application/pdf', 'image/jpg', 'image/tiff', 'image/png', 'image/jpeg']
    if (fileFormat.includes(file.mimetype)) {
      return cb(null, true)
    }

    return cb(new Error('Only pdf, jpeg, png, tiff, jpg format are allowed'))
  },
  storage,
})

export const deleteFile = async (filename: string): Promise<void> => {
  const params = {
    Bucket: 'wil-hire-uploads-dev',
    Key: filename,
  }

  try {
    await s3.headObject(params).promise()
    logger.info('File Found in S3')
    try {
      await s3.deleteObject(params).promise()
      logger.info('file deleted Successfully')
    } catch (err) {
      logger.info('ERROR in file Deleting : ' + JSON.stringify(err))
    }
  } catch (err: any) {
    logger.info('File not Found ERROR : ' + err.code)
  }
}
