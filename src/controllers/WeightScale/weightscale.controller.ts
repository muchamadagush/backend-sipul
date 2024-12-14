// data payload proses timbang
// {
//     "id": "fyhvhkvkuvs",
//     "weight": 150
// }

// api create data (proses timbang)
// api get all
// api update data (ubah type)
// api delete data (hapus data)
// apo get by id
// api dashboard (harian, bulanan, tahunan)

import { Request, Response } from 'express'
import routes from '../../routes/public'
import asyncHandler from '../../helpers/asyncHandler'
import BuildResponse from '../../modules/Response/BuildResponse'
import useValidation from '../../helpers/useValidation'
import weightScaleSchema from './weightscale.schema'
import WeightScaleService from './weightscale.service'

const weightScaleService = new WeightScaleService()

routes.get(
  '/weightscale',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await weightScaleService.getAll(req)
    const buildResponse = BuildResponse.get(data)

    res.status(200).json(buildResponse)
  })
)

routes.get(
  '/weightscale/leaderboard',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const { type } = req.getQuery()

    let data
    switch (type) {
      case 'daily':
        data = await weightScaleService.getDailyLeaderboard(req)
        break;
      case 'monthly':
        data = await weightScaleService.getDailyLeaderboard(req)
        break;
      case 'yearly':
        data = await weightScaleService.getDailyLeaderboard(req)
        break;

      default:
        break;
    }

    const buildResponse = BuildResponse.get(data)

    res.status(200).json(buildResponse)
  })
)

routes.post(
  '/weightscale',
  asyncHandler(async function create(req: Request, res: Response): Promise<any> {
    const formData = req.getBody()
    const txn = await req.getTransaction()
    const validatedData = useValidation(weightScaleSchema.create, formData)

    const newFormData = {
      ScaleId: validatedData.id,
      weight: validatedData.weight,
    }

    const data = await weightScaleService._model.create(newFormData, { transaction: txn })

    await txn.commit()

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.get(
  '/weightscale/:id',
  asyncHandler(async function getById(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()

    const data = await weightScaleService._model.findByPk(id)

    const buildResponse = BuildResponse.get({ data })
    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/weightscale/:id',
  asyncHandler(async function update(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    const formData = req.getBody()
    const txn = await req.getTransaction()

    const data = await weightScaleService.updated(id, formData, txn)

    await txn.commit()

    const buildResponse = BuildResponse.updated({ data })
    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/weightscale/:id',
  asyncHandler(async function deleted(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    const txn = await req.getTransaction()

    await weightScaleService.deleted(id, txn, true)

    await txn.commit()

    const buildResponse = BuildResponse.deleted({})
    return res.status(200).json(buildResponse)
  })
)
