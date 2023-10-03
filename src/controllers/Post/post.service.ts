import BaseRepository from '../../repositories/BaseRepository'
import { Request } from 'express'
import models from '../../models'
import { PostAttributes, PostInstance } from '../../models/post'
import slugify from 'slugify'
import PluginSqlizeQuery from '../../modules/SqlizeQuery/PluginSqlizeQuery'

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
}
