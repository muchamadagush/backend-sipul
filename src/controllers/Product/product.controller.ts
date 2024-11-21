import { Request, Response } from 'express'
import routes from '../../routes/public'
import asyncHandler from '../../helpers/asyncHandler'
import BuildResponse from '../../modules/Response/BuildResponse'
import useValidation from '../../helpers/useValidation'
import productSchema from './product.schema'
import ProductService from './product.service'

const productService = new ProductService()

routes.get(
  '/product',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await productService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    res.status(200).json(buildResponse)
  })
)

routes.post(
  '/product',
  asyncHandler(async function create(req: Request, res: Response): Promise<any> {
    const formData = req.getBody()
    const txn = await req.getTransaction()
    const validatedData = useValidation(productSchema.create, formData)

    const data = await productService._model.create(validatedData, { transaction: txn })

    await txn.commit()

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.get(
  '/product/:id',
  asyncHandler(async function getById(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()

    const data = await productService._model.findByPk(id)

    const buildResponse = BuildResponse.get({ data })
    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/product/:id',
  asyncHandler(async function update(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    const formData = req.getBody()
    const txn = await req.getTransaction()

    const data = await productService.updated(id, formData, txn)

    await txn.commit()

    const buildResponse = BuildResponse.updated({ data })
    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/product/:id',
  asyncHandler(async function deleted(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    const txn = await req.getTransaction()

    await productService.deleted(id, txn, true)

    await txn.commit()

    const buildResponse = BuildResponse.deleted({})
    return res.status(200).json(buildResponse)
  })
)
