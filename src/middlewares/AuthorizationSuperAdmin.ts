import { isEmpty } from 'lodash'
import { NextFunction, Request, Response } from 'express'
import { currentToken, verifyAccessToken } from '../helpers/Token'
import asyncHandler from '../helpers/asyncHandler'
import UserService from '../controllers/User/user.service'
import ResponseError from '../modules/Response/ResponseError'

async function AuthorizationSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const getToken = currentToken(req)
  const token: any = verifyAccessToken(getToken)

  if (isEmpty(token?.data)) {
    throw new ResponseError.Unauthorized(token?.message)
  }

  const userData = await UserService.verifyActiveUser(token?.data?.id)

  if (userData.role !== 'Super Admin') {
    throw new ResponseError.Forbidden(
      'this endpoint can only be accessed by users who have the superadmin role'
    )
  }

  req.setState({ userData })
  next()
}

export default asyncHandler(AuthorizationSuperAdmin)
