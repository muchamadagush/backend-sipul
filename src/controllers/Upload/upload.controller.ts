/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express'
import { Sequelize } from 'sequelize'
import BuildResponse from '../../modules/Response/BuildResponse'

import routes from '../../routes/public'
import uploadService from './upload.service'
import {
  uploadFile,
  setFileToBody,
} from './helpers/upload.multer'
import asyncHandler from '../../helpers/asyncHandler'

routes.post(
  '/upload',
  uploadFile,
  setFileToBody,
  asyncHandler(async function createData(req: Request, res: Response): Promise<any> {
    const formData = req.getBody()

    const data = await uploadService.createUploadFile(formData.dokumen)
    const buildResponse = BuildResponse.created(data)

    return res.status(201).json(buildResponse)
  })
)