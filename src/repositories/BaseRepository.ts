import { isEmpty, isObject } from 'lodash'
import { Request } from 'express'
import {
  Model,
  ModelCtor,
  Includeable,
  Transaction,
  FindOptions,
  WhereOptions,
} from 'sequelize'
import db from '../models/_instance'
import removeEmpty from '../helpers/removeEmpty'
import ResponseError from '../modules/Response/ResponseError'
import validationWording from '../constants/validationWording'
import PluginSqlizeQuery from '../modules/SqlizeQuery/PluginSqlizeQuery'
import { removeFile } from '../helpers/removeFile'
import { validateBoolean } from '../helpers/Common'
import { MyModels } from '../models'

const { Sequelize } = db
const { Op } = Sequelize

interface Associate {
  associate: (models: MyModels) => void
}

export default class BaseRepository<
  M extends Model,
  CreateParam
  // ConditionParam = {}
> {
  _model: ModelCtor<M> & Associate

  _defaultInclude: Includeable[]

  _name: string

  constructor(
    model: ModelCtor<M> & Associate,
    name: string,
    defaultInclude: Includeable[] = []
  ) {
    this._model = model
    this._defaultInclude = defaultInclude
    this._name = name
  }

  /**
   *
   * @param req Request
   */
  async getAll(
    req: Request,
    CompanyId?: any,
    customWhere?: object,
    customInclude?: Includeable[]
  ) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      this._model,
      this._defaultInclude?.length > 0
        ? PluginSqlizeQuery.makeIncludeQueryable(
            filtered,
            customInclude || this._defaultInclude
          )
        : []
    )

    if (CompanyId) {
      queryFind.where.CompanyId = CompanyId
    }

    if (isObject(customWhere)) {
      queryFind.where = {
        ...queryFind.where,
        ...customWhere,
      }
    }

    const data = await this._model.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await this._model.count({
      include: includeCount,
      where: queryFind.where,
    })

    return {
      message: `${data.length} data sudah diterima`,
      data,
      total,
      where: queryFind.where,
    }
  }

  /**
   *
   * @param req Request
   */
  async getAllByPartner(
    req: Request,
    LicenseBy?: string,
    CompanyId?: string,
    customWhere?: object
  ) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      this._model,
      this._defaultInclude?.length > 0
        ? PluginSqlizeQuery.makeIncludeQueryable(filtered, this._defaultInclude)
        : []
    )

    if (CompanyId) {
      queryFind.where.CompanyId = CompanyId
    }

    if (isObject(customWhere)) {
      queryFind.where = {
        ...queryFind.where,
        ...customWhere,
      }
    }

    const data = await this._model.findAll({
      ...queryFind,
      order: order.length ? order : [['createdAt', 'desc']],
    })
    const total = await this._model.count({
      include: includeCount,
      where: queryFind.where,
    })

    return {
      message: `${data.length} [dictionary.received].`,
      data,
      total,
    }
  }

  /**
   *
   * @param options
   */
  async find(options?: FindOptions<M['_attributes']>) {
    const data = await this._model.findAll({
      ...options,
      order: options?.order ? options.order : [['createdAt', 'desc']],
    })
    return data
  }

  /**
   *
   * @param id
   */
  async getOne(
    id: string,
    CompanyId?: any,
    paranoid?: boolean,
    includeParam?: Includeable[],
    attributes?: any,
    order?: any
  ) {
    if (CompanyId && attributes) attributes = [...attributes, 'CompanyId']

    const data = (await this._model.findByPk(id, {
      include: includeParam || this._defaultInclude,
      attributes: attributes || { exclude: ['x'] },
      order: order || [],
      paranoid,
    })) as M & { CompanyId?: string }

    if (!data) {
      throw new ResponseError.NotFound(validationWording.notFound(this._name))
    }

    if (CompanyId && data.CompanyId !== CompanyId) {
      throw new ResponseError.NotFound(
        validationWording.notFound(`${this._name}companyId`)
      )
    }

    return data
  }

  /**
   *
   * @param formData
   * @param txn Transaction Sequelize
   */
  async findOrCreate(formData: Partial<CreateParam>, txn?: Transaction) {
    const data = await this._model.findOrCreate({
      where: formData as any,
      transaction: txn,
    })

    return data
  }

  /**
   *
   * @param id
   * note: find by id only find data not include relation
   */
  async findById(
    id: string,
    CompanyId?: string,
    paranoid?: boolean,
    txn?: Transaction
  ) {
    const data = (await this._model.findByPk(id, {
      paranoid,
      transaction: txn,
    })) as M & {
      CompanyId?: string
    }

    if (!data) {
      throw new ResponseError.NotFound(validationWording.notFound(this._name))
    } else if (CompanyId && data.CompanyId !== CompanyId) {
      throw new ResponseError.NotFound(validationWording.notFound(this._name))
    }

    return data
  }

  /**
   *
   * @param id
   * note: find by id only find data not include relation
   */
  async findByIds(
    ids: string[],
    CompanyId?: string,
    paranoid?: boolean,
    txn?: Transaction
  ) {
    const whereParam: WhereOptions = {
      id: {
        [Op.in]: ids,
      },
    }

    if (CompanyId) {
      whereParam.CompanyId = CompanyId
    }

    const data = (await this._model.findAll({
      where: whereParam,
      paranoid,
      transaction: txn,
    })) as M[] & {
      CompanyId?: string
    }

    return data
  }

  /**
   *
   * @param ExternalId
   * note: find by id only find data not include relation
   */
  async findByExternalId(ExternalId: string, CompanyId?: string) {
    const data = (await this._model.findOne({
      where: {
        ExternalId: ExternalId as any,
      },
    })) as M & { CompanyId?: string }

    return data
  }

  async getAllIdAndExternalId(CompanyId?: string) {
    const data = await this._model.findAll({
      where: {
        CompanyId: CompanyId as any,
      },
      attributes: ['id', 'ExternalId'],
    })

    return data
  }

  /**
   *
   * @param formData
   */
  async create(formData: Omit<CreateParam, 'id'>, txn?: Transaction) {
    const data = await this._model.create(formData as any, { transaction: txn })
    return data
  }

  /**
   *
   * @param arrayFormData - formData array []
   * @param txn - Transaction
   */
  async bulkCreate(
    arrayFormData: Omit<CreateParam, 'id'>[],
    txn?: Transaction
  ) {
    const data = await this._model.bulkCreate(arrayFormData as any, {
      transaction: txn,
    })

    return data
  }

  /**
   *
   * @param id
   * @param CompanyId
   * @param formData
   */
  async update(
    id: string,
    CompanyId: string | undefined,
    formData: Partial<CreateParam>,
    filename?: string | string[],
    txn?: Transaction,
    isRemoveEmpty: boolean = true
  ) {
    const data = await this.findById(id, CompanyId)
    const dataJSON = JSON.parse(JSON.stringify(data.toJSON()))

    if (filename) {
      if (Array.isArray(filename)) {
        for (let i = 0; i < filename.length; i += 1) {
          removeFile(dataJSON[filename[i]])
        }
      } else if (dataJSON[filename]) {
        removeFile(dataJSON[filename])
      }
    }

    const cleanFormData = isRemoveEmpty ? removeEmpty(formData) : formData
    const value = { ...dataJSON, ...cleanFormData }

    await data.update(value || {}, { transaction: txn })

    return data
  }

  /**
   *
   * @param data
   * @param formData
   * @param filename
   * @param txn
   */
  // eslint-disable-next-line class-methods-use-this
  async updateWithoutFind(
    data: M,
    formData: Partial<CreateParam>,
    isRemoveEmpty: boolean,
    filename?: string | string[],
    txn?: Transaction
  ) {
    const dataJSON = JSON.parse(JSON.stringify(data.toJSON()))
    if (filename) {
      if (Array.isArray(filename)) {
        for (let i = 0; i < filename.length; i += 1) {
          removeFile(dataJSON[filename[i]])
        }
      } else if (dataJSON[filename]) {
        removeFile(dataJSON[filename])
      }
    }

    const cleanFormData = isRemoveEmpty ? removeEmpty(formData) : formData

    const value = { ...dataJSON, ...cleanFormData }
    await data.update(value || {}, { transaction: txn })
    return value
  }

  /**
   *
   * @param id
   * @param CompanyId
   * @param force - Force Deleted
   */
  async delete(
    id: string,
    CompanyId?: string,
    force?: boolean,
    filename?: string | string[],
    txn?: Transaction
  ) {
    const isForce = validateBoolean(force)

    const data = await this.findById(id, CompanyId)
    const dataJSON = JSON.parse(JSON.stringify(data.toJSON()))
    if (filename) {
      if (Array.isArray(filename)) {
        for (let i = 0; i < filename.length; i += 1) {
          if (dataJSON[filename[i]]) {
            removeFile(dataJSON[filename[i]])
          }
        }
      } else if (dataJSON[filename]) {
        removeFile(dataJSON[filename])
      }
    }
    await data.destroy({ force: isForce, transaction: txn })
    return data
  }

  /**
   *
   * @param id - Restore data from Trash
   * @param CompanyId
   */
  async restore(id: string, CompanyId?: string, txn?: Transaction) {
    const data = await this.findById(id, CompanyId, false)
    await data.restore({ transaction: txn })
  }

  //   /**
  //    *
  //    * @param ids
  //    * @param CompanyId
  //    * @param force - Force Deleted
  //    * @example ids = ["id_1", "id_2"]
  //    */
  async multipleDelete(
    ids: Array<string>,
    CompanyId?: string,
    force?: boolean,
    txn?: Transaction
  ) {
    const isForce = validateBoolean(force)

    if (isEmpty(ids)) {
      throw new ResponseError.BadRequest('id [wording.notEmpty]')
    }

    const whereParam: WhereOptions = {
      id: {
        [Op.in]: ids,
      },
    }

    if (CompanyId) {
      whereParam.CompanyId = CompanyId
    }

    await this._model.destroy({
      where: whereParam as any,
      force: isForce,
      transaction: txn,
    })
  }

  /**
   *
   * @param ids
   * @param CompanyId
   * @example ids = ["id_1", "id_2"]
   */
  async multipleRestore(
    ids: Array<string>,
    CompanyId?: string,
    txn?: Transaction
  ) {
    if (isEmpty(ids)) {
      throw new ResponseError.BadRequest('id [wording.notEmpty]')
    }

    const whereParam: WhereOptions = {
      id: {
        [Op.in]: ids,
      },
    }

    if (CompanyId) {
      whereParam.CompanyId = CompanyId
    }

    await this._model.restore({
      where: whereParam as any,
      transaction: txn,
    })
  }
}
