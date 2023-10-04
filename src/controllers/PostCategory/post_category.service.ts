import BaseRepository from '../../repositories/BaseRepository'
import models from '../../models'
import { PostCategoryAttributes, PostCategoryInstance } from '../../models/postcategory'

const { PostCategory } = models

export default class PostService extends BaseRepository<
  PostCategoryInstance,
  PostCategoryAttributes
> {
  constructor() {
    super(PostCategory, 'Post Category', [])
  }
}
