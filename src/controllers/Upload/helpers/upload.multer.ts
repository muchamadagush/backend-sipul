import { Request, Response, NextFunction } from 'express'
import Multers from '../../../helpers/Multer'

import asyncHandler from '../../../helpers/asyncHandler'
import ConfigMulter from '../../../modules/ConfigMulter'

export const pathFile = 'public/uploads/tmp/'

export const uploadAllowedExtDocument = ['.pdf', '.docx']
export const uploadAllowedExtImage = ['.png', '.jpg', '.jpeg', '.gif']
export const uploadAllowedExtVideo = [
  '.mp4',
  '.flv',
  '.mov',
  '.mpg',
  '.avi',
  '.webm',
]

export const uploadAllowedExt = [
  ...uploadAllowedExtDocument,
  ...uploadAllowedExtImage,
  ...uploadAllowedExtVideo,
]

// Upload File
export const uploadFile = ConfigMulter({
  dest: pathFile,
  allowedExt: uploadAllowedExt,
  limit: {
    fieldSize: 5 * 1024 * 1024 * 1024, // 5gb
    fileSize: 1024 * 1024 * 1024, // 1gb
  },
}).fields([{ name: 'dokumen', maxCount: 1 }])

export const setFileToBody = asyncHandler(async function setFileToBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const objFile = Multers.pickSingleFieldMulter(req, ['dokumen'])

  req.setBody(objFile)
  next()
})
