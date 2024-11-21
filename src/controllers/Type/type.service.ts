import BaseRepository from '../../repositories/BaseRepository'
import { Request } from 'express'
import models from '../../models'
import { TypeAttributes, TypeInstance } from '../../models/type'
import { Transaction } from 'sequelize'
import ResponseError from '../../modules/Response/ResponseError'
import useValidation from '../../helpers/useValidation'
import typeSchema from './type.schema'

const { Type } = models

export default class TypeService extends BaseRepository<
  TypeInstance,
  TypeAttributes
> {
  constructor() {
    super(Type, 'Type', [])
  }

  async getAll(req: Request, customWhere?: object) {
    const data = await super.getAll(req, customWhere)

    return { message: data.message, count: data.total, data: data.data } as any
  }

  async updated(id: string, formData: { title: string }, txn: Transaction) {
    const type = await this._model.findByPk(id)

    if (!type) throw new ResponseError.NotFound('Type tidak ditemukan')

    const validatedData: any = useValidation(typeSchema.update, formData)

    await type.update(validatedData, { transaction: txn })

    return type
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
