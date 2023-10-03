import BaseRepository from '../../repositories/BaseRepository'
import { Request } from 'express'
import models from '../../models'
import { CategoryAttributes, CategoryInstance } from '../../models/category'
import { Transaction } from 'sequelize'
import ResponseError from '../../modules/Response/ResponseError'
import useValidation from '../../helpers/useValidation'
import categorySchema from './category.schema'

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

  async updated(id: string, formData: { title: string }, txn: Transaction) {
    const category = await this._model.findByPk(id)

    if (!category) throw new ResponseError.NotFound('Category tidak ditemukan')

    const validatedData: any = useValidation(categorySchema.update, formData)

    await category.update(validatedData, { transaction: txn })

    return category
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
