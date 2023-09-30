import { Request, Response } from 'express'
import routes from '../../routes/public'
import asyncHandler from '../../helpers/asyncHandler'
import BuildResponse from '../../modules/Response/BuildResponse'
import CategoryService from '../../controllers/Category/category.service'
import AuthorizationSuperAdmin from '../../middlewares/AuthorizationSuperAdmin'

const categoryService = new CategoryService()

routes.get(
  '/category',
  AuthorizationSuperAdmin,
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await categoryService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    res.status(200).json(buildResponse)
  })
)
