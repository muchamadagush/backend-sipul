import BaseRepository from '../../repositories/BaseRepository'
import { Request } from 'express'
import models from '../../models'
import { CategoryAttributes, CategoryInstance } from '../../models/category'

const { Category } = models

export default class CategoryService extends BaseRepository<
  CategoryInstance,
  CategoryAttributes
> {
  constructor() {
    super(Category, 'Category', [])
  }

  async getAll(req: Request, customWhere?: object) {
    const data = await super.getAll(req, customWhere)

    return { message: data.message, count: data.total, data: data.data } as any
  }
}
