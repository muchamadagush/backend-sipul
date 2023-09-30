import { Transaction } from 'sequelize'
import models from '../../models'
import { Request } from 'express'
import useValidation from '../../helpers/useValidation'
import schema from './user.schema'
import bcrypt from 'bcryptjs'
import PluginSqlizeQuery from '../../modules/SqlizeQuery/PluginSqlizeQuery'
import ResponseError from '../../modules/Response/ResponseError'

const { User, File } = models

interface ICreateUser {
  fullName: string
  email: string
  role: string
  newPassword: string
  confirmNewPassword: string
}

const includeGetAll = [
  {
    model: File,
    as: 'Avatar',
  }
]

class UserService {
  /**
   *
   * @param req Request
   */
  public static async getAllUser(req: Request) {
    const { filtered } = req.query
    const { includeCount, order, ...queryFind } = PluginSqlizeQuery.generate(
      req.query,
      User,
      PluginSqlizeQuery.makeIncludeQueryable(filtered, includeGetAll)
    )
    const data = await User.findAll({
      ...queryFind,
      order: order ? order : [['createdAt', 'asc']]
    })

    const count = await User.count({
      include: includeCount
    })

    return {
      message: `${count} data sudah diterima`,
      count,
      data,
    }
  }

  /**
   *
   * @param formData ICreateUser
   * @param txn Transaction
   */
  public static async create(formData: ICreateUser, txn: Transaction) {
    const validatedData = useValidation(schema.create, formData)

    const { newPassword, confirmNewPassword } = validatedData
    const fdPassword = { newPassword, confirmNewPassword }
    const validPassword = schema.createPassword.validateSyncAt(
      'confirmNewPassword',
      fdPassword
    )
    const saltRounds = 10
    const password = bcrypt.hashSync(validPassword, saltRounds)

    const data = await User.create({ ...validatedData, password }, { transaction: txn })

    return data
  }

  /**
   *
   * @param req Request
   */
  public static async getUserById(id: string) {
    const data = await User.findByPk(id, {
      include: includeGetAll
    })

    return data
  }

  /**
   *
   * @param id string
   * @param formData ICreateUser
   * @param txn Transaction
   */
  public static async update(id: string, formData: ICreateUser, txn: Transaction) {

    const user = await User.findByPk(id)

    if (!user) throw new ResponseError.NotFound('User tidak ditemukan')

    const validatedData: any = useValidation(schema.update, formData)

    if (validatedData.newPassword || validatedData.confirmNewPassword) {
      const { newPassword, confirmNewPassword } = validatedData
      const fdPassword = { newPassword, confirmNewPassword }
      const validPassword = schema.createPassword.validateSyncAt(
        'confirmNewPassword',
        fdPassword
      )
      const saltRounds = 10
      validatedData.password = bcrypt.hashSync(validPassword, saltRounds)
    }

    await user.update(validatedData, { transaction: txn })

    return user
  }

  /**
   *
   * @param req Request
   */
  public static async delete(id: string, txn: Transaction, isForce: boolean = false) {
    await User.destroy({
      where: { id },
      force: isForce,
      transaction: txn
    })

    return true
  }

  /**
   *
   * @param id
   */
  public static async verifyActiveUser(id: string) {
    const userData = await User.findByPk(id, { paranoid: false })

    if (!userData || userData.deletedAt) {
      throw new ResponseError.Unauthorized('Akun Anda telah dihapus')
    }

    return userData
  }
}

export default UserService
