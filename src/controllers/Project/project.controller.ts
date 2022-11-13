/* eslint-disable no-await-in-loop */
import { Request, Response } from 'express'

import routes from '../../routes/public'
import ProjectService from './project.service'

routes.get(
  '/project',
    async function findAll(req: Request, res: Response) {

    const data = await ProjectService.getAllProject(req)

    return res.status(200).json(data)
  }
)
