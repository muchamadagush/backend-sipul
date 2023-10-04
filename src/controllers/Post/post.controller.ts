import { NextFunction, Request, Response } from 'express'
import routes from '../../routes/public'
import asyncHandler from '../../helpers/asyncHandler'
import BuildResponse from '../../modules/Response/BuildResponse'
import PostService from '../../controllers/Post/post.service'
import schema from '../../controllers/Post/post.schema'
import Authorization from '../../middlewares/Authorization'
import useValidation from '../../helpers/useValidation'
import PostCategoryService from '../../controllers/PostCategory/post_category.service'
import { isEmpty } from 'lodash'
import schemaPostCategory from '../../controllers/PostCategory/post_category.schema'

const postService = new PostService()
const postCategoryService = new PostCategoryService()

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
  asyncHandler(async function create(req: Request, res: Response, next: NextFunction): Promise<any> {
    const formData = req.getBody()
    const txn = await req.getTransaction()

    
    const validatedData = useValidation(schema.create, formData)

    const newValidatedData = {
      ...validatedData,
      slug: await postService.generateSlugFromTitle(validatedData.title)
    }
    
    const data = await postService._model.create(newValidatedData, { transaction: txn })

    req.setState({ data, validatedData })
    next()
  }),
  asyncHandler(async function createPostCategory(req: Request, res: Response): Promise<any> {
    const validatedData = req.getState('validatedData')
    const data = req.getState('data')
    const txn = await req.getTransaction()


    if (!isEmpty(validatedData.categoryIds)) {
      const bulkData = []
      for (const category of validatedData.categoryIds) {
        const validatedPostCategory = useValidation(schemaPostCategory.create, { categoryId: category, postId: data.id })

        bulkData.push(validatedPostCategory)
      }
      
      await postCategoryService._model.bulkCreate(bulkData, { transaction: txn })
    }

    await txn.commit()

    const buildResponse = BuildResponse.created({ data })
    return res.status(201).json(buildResponse)
  }),
)

routes.get(
  '/post/:id',
  asyncHandler(async function getById(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()

    const data = await postService.getById(id)

    const buildResponse = BuildResponse.get({ data })
    return res.status(200).json(buildResponse)
  })
)

routes.get(
  '/post/get-by-slug/:slug',
  asyncHandler(async function getBySlug(req: Request, res: Response): Promise<any> {
    const { slug } = req.getParams()

    const data = await postService.getBySlug(slug)

    const buildResponse = BuildResponse.get({ data })
    return res.status(200).json(buildResponse)
  })
)

routes.delete(
  '/post/:id',
  Authorization,
  asyncHandler(async function deleted(req: Request, res: Response): Promise<any> {
    const { id } = req.getParams()
    const txn = await req.getTransaction()

    await postService.deleted(id, txn, true)

    await txn.commit()

    const buildResponse = BuildResponse.deleted({})
    return res.status(200).json(buildResponse)
  })
)
