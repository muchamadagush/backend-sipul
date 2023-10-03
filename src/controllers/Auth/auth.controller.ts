import { Request, Response } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import routes from '../../routes/public'
import AuthService from './auth.service'
import BuildResponse from '../../modules/Response/BuildResponse'
import Authorization from '../../middlewares/Authorization'
import UserService from '../User/user.service'

routes.post(
  '/auth/login',
  asyncHandler(async function login(req: Request, res: Response): Promise<any> {
    const formData = req.getBody()

    const data = await AuthService.login(formData)

    const buildResponse = BuildResponse.get(data)

    res
      .cookie('token', data.accessToken, {
        maxAge: data.expiresIn,
        httpOnly: true,
        path: '/v1',
        secure: process.env.NODE_ENV === 'production',
      })
      .json(buildResponse)
  })
)

routes.get(
  '/profile',
  Authorization,
  asyncHandler(async function login(req: Request, res: Response): Promise<any> {
    const userData = req.getState('userData')

    const data = await UserService.getUserById(userData.id)

    const buildResponse = BuildResponse.get({ data })
    return res.status(200).json(buildResponse)
  })
)
