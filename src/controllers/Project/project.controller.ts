/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import BuildResponse from '../../modules/Response/BuildResponse'
import ResponseError from '../../modules/Response/ResponseError'

import routes from '../../routes/public'
import ProjectService from './project.service'

routes.get(
  '/project',
  asyncHandler(async function findAll(req: Request, res: Response): Promise<any> {

    const data = await ProjectService.getAllProject(req)

    return res.status(200).json(data)
  })
)

routes.post(
  '/project',
  asyncHandler(async function createProject(req: Request, res: Response): Promise<any> {
    const formData = req.getBody()
    
    const data = await ProjectService.createProject(formData)

    return res.status(201).json(data)
  })
)

routes.get(
  '/project/:id',
  asyncHandler(async function findById(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    
    const data = await ProjectService.findById(id)

    return res.status(200).json(data)
  })
)

routes.delete(
  '/project/:id',
  asyncHandler(async function deleteProject(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    
    const data = await ProjectService.findById(id)

    if (!data.data) {
      throw new ResponseError.BadRequest('Data tidak ditemukan')
    }
    
    await ProjectService.deleteProject(id, true)

    return res.status(200).json({
      message: 'Berhasil menghapus data',
      data: data.data,
    })
  })
)

routes.put(
  '/project/:id',
  asyncHandler(async function updateProject(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    const formData = req.getBody()
    
    await ProjectService.updateProject(id, formData)

    const buildResponse = BuildResponse.updated({})

    return res.status(201).json(buildResponse)
  })
)
