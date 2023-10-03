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

  generateSlugFromTitle(title: string) {
    const titleWithoutQuestionMark = title.replace(/\?/g, '')

    const slugOptions = {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    };
    return slugify(titleWithoutQuestionMark, slugOptions);
  }
}
