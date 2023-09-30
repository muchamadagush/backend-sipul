import ms from 'ms'
import jwt from 'jsonwebtoken'
import models from '../../models'
import db from '../../models/_instance'
import useValidation from '../../helpers/useValidation'
import ResponseError from '../../modules/Response/ResponseError'
import schemaAuth from '../../controllers/Auth/auth.schema'
import { StatusUser, LoginAttributes } from '../../models/user'
import moment from 'moment'

moment.locale('id')

const { User } = models

const {
  JWT_SECRET_ACCESS_TOKEN,
}: {
  [key: string]: string | undefined
} = process.env
const JWT_ACCESS_TOKEN_EXPIRED = process.env.JWT_ACCESS_TOKEN_EXPIRED || '7d' // 7 Days

const expiresIn = ms(JWT_ACCESS_TOKEN_EXPIRED)

const { Sequelize } = db
const { Op } = Sequelize

class AuthService {
  /**
   *
   * @param formData
   */
  public static async login(
    formData: LoginAttributes,
  ) {
    const value = useValidation(schemaAuth.login, formData)

    const userData = await User.scope('withPassword').findOne({
      where: {
        [Op.or]: [{ email: value.email }],
      },
    })

    if (!userData) {
      throw new ResponseError.BadRequest('email atau kata sandi salah')
    }

    const comparePassword = await userData.comparePassword(value.password)

    if (!comparePassword) {
      throw new ResponseError.BadRequest('email atau kata sandi salah')
    }

    switch (userData.status) {
      case StatusUser.Suspend: {
        throw new ResponseError.BadRequest(
          'Akun Anda telah ditangguhkan oleh administrator. silakan hubungi administrator jika Anda ingin mengetahui alasan penangguhan akun Anda',
          401
        )
      }
      case StatusUser.Active: {
        // Access Token
        const accessToken = jwt.sign(
          JSON.parse(JSON.stringify({ id: userData.id })),
          JWT_SECRET_ACCESS_TOKEN as string,
          {
            expiresIn,
          }
        )

        delete userData.dataValues.password

        return {
          message: 'Berhasil masuk',
          accessToken,
          expiresIn,
          tokenType: 'Bearer',
          user: userData,
        }
      }
      default: {
        throw new ResponseError.BadRequest('Status akun Anda tidak dikenali, silakan hubungi administrator untuk melaporkan dan memperbaiki kerusakan pada akun Anda')
      }
    }
  }
}

export default AuthService
