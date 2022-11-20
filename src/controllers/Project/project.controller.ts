/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express'
import asyncHandler from '../../helpers/asyncHandler'

import routes from '../../routes/public'
import ProjectService from './project.service'

routes.get(
  '/project',
  asyncHandler(async function findAll(req: Request, res: Response) {

    const data = await ProjectService.getAllProject(req)

    return res.status(200).json(data)
  })
)

routes.post(
  '/project',
  asyncHandler(async function createProject(req: Request, res: Response) {
    const formData = req.body
    
    const data = await ProjectService.createProject(formData)

    return res.status(201).json(data)
  })
)

routes.get(
  '/project/:id',
  asyncHandler(async function findById(req: Request, res: Response) {
    const { id } = req.getParams()
    
    const data = await ProjectService.findById(id)

    return res.status(200).json(data)
  })
)



routes.delete(
  '/project/:id',
    async function deleteProject(req: Request, res: Response) {
    const { id } = req.params
    
    const data = await ProjectService.findById(id)

    if (!data.data) {
      return res.status(404).json({ message: 'Data tidak ditemukan'})
    }
    
    await ProjectService.deleteProject(id, true)

    return res.status(200).json({
      message: 'Berhasil menghapus data',
      data: data.data,
    })
  }
)
