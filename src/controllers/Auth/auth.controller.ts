import { Request, Response } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import routes from '../../routes/public'
import AuthService from './auth.service'
import BuildResponse from '../../modules/Response/BuildResponse'

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
