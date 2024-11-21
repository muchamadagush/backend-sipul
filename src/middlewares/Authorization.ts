// import { isEmpty } from 'lodash'
// import { NextFunction, Request, Response } from 'express'
// import { currentToken, verifyAccessToken } from '../helpers/Token'
// import asyncHandler from '../helpers/asyncHandler'
// import UserService from '../controllers/User/user.service'
// import ResponseError from '../modules/Response/ResponseError'


// async function Authorization(req: Request, res: Response, next: NextFunction) {
//   const getToken = currentToken(req)
//   const token: any = verifyAccessToken(getToken)

//   if (isEmpty(token?.data) || isEmpty(token?.data?.id)) {
//     throw new ResponseError.Unauthorized(token?.message)
//   }

//   const userData = await UserService.verifyActiveUser(token?.data?.id)


//   req.setState({ userData })
//   next()
// }

// export default asyncHandler(Authorization)
