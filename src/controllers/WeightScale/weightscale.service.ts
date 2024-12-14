import BaseRepository from '../../repositories/BaseRepository'
import { Request } from 'express'
import models from '../../models'
import { Op, Transaction } from 'sequelize'
import ResponseError from '../../modules/Response/ResponseError'
import useValidation from '../../helpers/useValidation'
import weightScaleSchema from './weightscale.schema'
import { WeightScaleAttributes, WeightScaleInstance } from '../../models/weightscale'

const { WeightScale } = models

export default class WeightScaleService extends BaseRepository<
  WeightScaleInstance,
  WeightScaleAttributes
> {
  constructor() {
    super(WeightScale, 'WeightScale', [])
  }

  async getAll(req: Request, customWhere?: object) {
    const data = await super.getAll(req, customWhere)

    return { message: data.message, count: data.total, data: data.data } as any
  }

  async getLeaderboard(dateRange: [Date, Date]) {
      const leaderboard = await WeightScale.findAll({
        attributes: [
          'ProductId',
          [WeightScale.sequelize!.fn('SUM', WeightScale.sequelize!.col('weight')), 'totalWeight'],
          [WeightScale.sequelize!.fn('MIN', WeightScale.sequelize!.col('createdAt')), 'earliestDate'],
        ],
        where: {
          createdAt: {
            [Op.between]: dateRange,
          },
        },
        group: ['ProductId'],
        order: [
          ['earliestDate', 'ASC'],
          ['totalWeight', 'DESC'],
        ],
      })
  
      return leaderboard
  }
  
  async getDailyLeaderboard(req: Request) {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    
    await this.getLeaderboard([startOfDay, endOfDay])
  }
  
  async getMonthlyLeaderboard(req: Request) {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    await this.getLeaderboard([startOfMonth, endOfMonth])
  }
  
  async getYearlyLeaderboard(req: Request) {
    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 1)
    const endOfYear = new Date(today.getFullYear(), 11, 31)
    
    await this.getLeaderboard([startOfYear, endOfYear])
  }

  async updated(id: string, formData: { title: string }, txn: Transaction) {
    const data = await this._model.findByPk(id)

    if (!data) throw new ResponseError.NotFound('Data tidak ditemukan')

    const validatedData: any = useValidation(weightScaleSchema.update, formData)

    await data.update(validatedData, { transaction: txn })

    return data
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
