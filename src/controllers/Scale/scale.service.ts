import BaseRepository from '../../repositories/BaseRepository'
import { Request } from 'express'
import models from '../../models'
import { Transaction } from 'sequelize'
import ResponseError from '../../modules/Response/ResponseError'
import useValidation from '../../helpers/useValidation'
import scaleSchema from './scale.schema'
import { ScaleAttributes, ScaleInstance } from '../../models/scale'

const { Scale } = models

export default class TypeService extends BaseRepository<
  ScaleInstance,
  ScaleAttributes
> {
  constructor() {
    super(Scale, 'Scale', [])
  }

  async getAll(req: Request, customWhere?: object) {
    const data = await super.getAll(req, customWhere)

    return { message: data.message, count: data.total, data: data.data } as any
  }

  async updated(id: string, formData: { title: string }, txn: Transaction) {
    const scale = await this._model.findByPk(id)

    if (!scale) throw new ResponseError.NotFound('Scale tidak ditemukan')

    const validatedData: any = useValidation(scaleSchema.update, formData)

    await scale.update(validatedData, { transaction: txn })

    return scale
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
