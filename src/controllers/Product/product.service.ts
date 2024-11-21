import BaseRepository from '../../repositories/BaseRepository'
import { Request } from 'express'
import models from '../../models'
import { Transaction } from 'sequelize'
import ResponseError from '../../modules/Response/ResponseError'
import useValidation from '../../helpers/useValidation'
import productSchema from './product.schema'
import { ProductAttributes, ProductInstance } from '../../models/product'

const { Product } = models

export default class TypeService extends BaseRepository<
  ProductInstance,
  ProductAttributes
> {
  constructor() {
    super(Product, 'Product', [])
  }

  async getAll(req: Request, customWhere?: object) {
    const data = await super.getAll(req, customWhere)

    return { message: data.message, count: data.total, data: data.data } as any
  }

  async updated(id: string, formData: { title: string }, txn: Transaction) {
    const product = await this._model.findByPk(id)

    if (!product) throw new ResponseError.NotFound('Product tidak ditemukan')

    const validatedData: any = useValidation(productSchema.update, formData)

    await product.update(validatedData, { transaction: txn })

    return product
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
