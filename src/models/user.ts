import { DataTypes, Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface UserAttributes {
  id: string
  fullName: string
  email: string
  role: string
  password: string
  avatar?: string | null
  newPassword?: string
  confirmNewPassword?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
  UserAttributes { }

const User = db.sequelize.define<UserInstance>(
  'Users',
  {
    ...SequelizeAttributes.Users,
    newPassword: {
      type: DataTypes.VIRTUAL,
    },
    confirmNewPassword: {
      type: DataTypes.VIRTUAL,
    },
  },
  {
    paranoid: true,
    defaultScope: {
      attributes: {
        exclude: ['password', 'tokenVerify'],
      },
    },
    scopes: {
      withPassword: {},
    },
  }
)

User.associate = (models: any) => {
  User.belongsTo(models.File, {
    foreignKey: 'avatar',
    as: 'Avatar',
  })
}

export default User
