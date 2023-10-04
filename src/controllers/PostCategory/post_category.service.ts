import BaseRepository from '../../repositories/BaseRepository'
import models from '../../models'
import { PostCategoryAttributes, PostCategoryInstance } from '../../models/postcategory'
import { Op, Transaction } from 'sequelize'

const { PostCategory } = models

export default class PostService extends BaseRepository<
  PostCategoryInstance,
  PostCategoryAttributes
> {
  constructor() {
    super(PostCategory, 'Post Category', [])
  }

  async removeNotInIds(postId: string, categoryIds: string[], txn: Transaction) {
    await this._model.destroy({
      where: {
        postId,
        categoryId: { [Op.notIn]: categoryIds },
      },
      force: true,
      transaction: txn
    })

    return true
  }
}
