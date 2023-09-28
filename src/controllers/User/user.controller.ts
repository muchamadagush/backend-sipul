import { Request, Response } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import routes from '../../routes/public'
import UserService from './user.service'
import BuildResponse from '../../modules/Response/BuildResponse'

routes.get(
  '/user',
  asyncHandler(async function getAll(req: Request, res: Response): Promise<any> {
    const data = await UserService.getAllUser(req)

    const buildResponse = BuildResponse.get(data)
    return res.status(200).json(buildResponse)
  })
)

routes.post(
  '/user',
  asyncHandler(async function create(req: Request, res: Response): Promise<any> {
    const formData = req.getBody()
    const txn = await req.getTransaction()

    const data = await UserService.create(formData, txn)

    await txn.commit()

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)

routes.get(
  '/user/:id',
  asyncHandler(async function getUserById(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()

    const data = await UserService.getUserById(id)

    const buildResponse = BuildResponse.get({ data })
    return res.status(200).json(buildResponse)
  })
)

routes.put(
  '/user/:id',
  asyncHandler(async function update(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    const formData = req.getBody()
    const txn = await req.getTransaction()

    const data = await UserService.update(id, formData, txn)

    await txn.commit()

    const buildResponse = BuildResponse.updated({ data })
    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/user/:id',
  asyncHandler(async function deleted(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    const txn = await req.getTransaction()

    await UserService.delete(id, txn, true)

    await txn.commit()

    const buildResponse = BuildResponse.deleted({})
    return res.status(200).json(buildResponse)
  })
)
