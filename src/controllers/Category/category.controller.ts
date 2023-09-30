import { Request, Response } from 'express'
import routes from '../../routes/public'
import asyncHandler from '../../helpers/asyncHandler'
import BuildResponse from '../../modules/Response/BuildResponse'
import CategoryService from '../../controllers/Category/category.service'
import Authorization from '../../middlewares/Authorization'
import useValidation from '../../helpers/useValidation'
import categorySchema from './category.schema'

const categoryService = new CategoryService()

routes.get(
  '/category',
  Authorization,
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await categoryService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    res.status(200).json(buildResponse)
  })
)

routes.post(
  '/category',
  Authorization,
  asyncHandler(async function create(req: Request, res: Response): Promise<any> {
    const formData = req.getBody()
    const txn = await req.getTransaction()
    const validatedData = useValidation(categorySchema.create, formData)

    const data = await categoryService._model.create(validatedData, { transaction: txn })

    await txn.commit()

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)
