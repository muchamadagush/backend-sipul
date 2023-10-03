import { Request, Response } from 'express'
import routes from '../../routes/public'
import asyncHandler from '../../helpers/asyncHandler'
import BuildResponse from '../../modules/Response/BuildResponse'
import PostService from '../../controllers/Post/post.service'
import schema from '../../controllers/Post/post.schema'
import Authorization from '../../middlewares/Authorization'
import useValidation from '../../helpers/useValidation'

const postService = new PostService()

routes.get(
  '/post',
  asyncHandler(async function getAll(req: Request, res: Response) {
    const data = await postService.getAllPost(req)
    const buildResponse = BuildResponse.get(data)

    res.status(200).json(buildResponse)
  })
)

routes.post(
  '/post',
  Authorization,
  asyncHandler(async function create(req: Request, res: Response): Promise<any> {
    const formData = req.getBody()
    const txn = await req.getTransaction()

    
    const validatedData = useValidation(schema.create, formData)

    const newValidatedData = {
      ...validatedData,
      slug: postService.generateSlugFromTitle(validatedData.title)
    }
    
    const data = await postService._model.create(newValidatedData, { transaction: txn })

    await txn.commit()

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  })
)
