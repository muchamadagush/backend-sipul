import { Request, Response } from 'express'
import routes from '../../routes/public'
import asyncHandler from '../../helpers/asyncHandler'
import BuildResponse from '../../modules/Response/BuildResponse'
import useValidation from '../../helpers/useValidation'
import scaleSchema from './scale.schema'
import ScaleService from './scale.service'

const scaleService = new ScaleService()

routes.get(
  '/scale',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await scaleService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    res.status(200).json(buildResponse)
  })
)

routes.post(
  '/scale',
  asyncHandler(async function create(req: Request, res: Response): Promise<any> {
    const formData = req.getBody()
    const txn = await req.getTransaction()
    const validatedData = useValidation(scaleSchema.create, formData)

    const data = await scaleService._model.create(validatedData, { transaction: txn })

    await txn.commit()

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.get(
  '/scale/:id',
  asyncHandler(async function getById(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()

    const data = await scaleService._model.findByPk(id)

    const buildResponse = BuildResponse.get({ data })
    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/scale/:id',
  asyncHandler(async function update(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    const formData = req.getBody()
    const txn = await req.getTransaction()

    const data = await scaleService.updated(id, formData, txn)

    await txn.commit()

    const buildResponse = BuildResponse.updated({ data })
    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/scale/:id',
  asyncHandler(async function deleted(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    const txn = await req.getTransaction()

    await scaleService.deleted(id, txn, true)

    await txn.commit()

    const buildResponse = BuildResponse.deleted({})
    return res.status(200).json(buildResponse)
  })
)
