import BaseRepository from '../../repositories/BaseRepository'
import { Request } from 'express'
import models from '../../models'
import { PostAttributes, PostInstance } from '../../models/post'
import slugify from 'slugify'
import PluginSqlizeQuery from '../../modules/SqlizeQuery/PluginSqlizeQuery'
import { Transaction } from 'sequelize'
import ResponseError from '../../modules/Response/ResponseError'
import useValidation from '../../helpers/useValidation'
import schema from '../../controllers/Post/post.schema'

const { Post } = models

export default class PostService extends BaseRepository<
  PostInstance,
  PostAttributes
> {
  constructor() {
    super(Post, 'Post', [])
  }

  async getAllPost(req: Request) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      this._model,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, [])
    )
    const data = await this._model.findAll({
      ...queryFind,
      order: order ? order : [['createdAt', 'desc']]
    })

    const count = await this._model.count({
      include: includeCount
    })

    return {
      message: `${count} data sudah diterima`,
      count,
      data,
    }
  }

  async generateUniqueSlug(desiredSlug: string) {
    let slug = desiredSlug
    let counter = 1
  
    while (true) {
      const existingPost = await this._model.findOne({ where: { slug } })
  
      if (!existingPost) {
        return slug
      }
  
      counter++
      slug = `${desiredSlug}-${counter}`
    }
  };

  async generateSlugFromTitle(title: string) {
    const titleWithoutQuestionMark = title.replace(/\?/g, '')

    const desiredSlug = slugify(titleWithoutQuestionMark, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    })
    const uniqueSlug = await this.generateUniqueSlug(desiredSlug)

    return uniqueSlug
  }

  async getById(id: string) {
    const data = await this._model.findByPk(id)

    return data
  }

  async getBySlug(slug: string) {
    const data = await this._model.findOne({
      where: { slug }
    })

    return data
  }

  async updated(id: string, formData: PostAttributes, txn: Transaction) {
    const post = await this._model.findByPk(id)

    if (!post) throw new ResponseError.NotFound('Post tidak ditemukan')

    await post.update(formData, { transaction: txn })

    return post
  }

  async deleted(id: string, txn: Transaction, isForce: boolean = false) {
    await this._model.destroy({
      where: { id },
      force: isForce,
      transaction: txn
    })

    return true
  }
}
