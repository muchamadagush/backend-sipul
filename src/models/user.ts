import { DataTypes, Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'
import bcrypt from 'bcryptjs'

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

export enum StatusUser {
  'Suspend' = 'Suspend',
  'Active' = 'Active',
}

export interface LoginAttributes {
  email: string
  password: string
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

// Compare password
User.prototype.comparePassword = function (candidatePassword: string) {
  console.log(candidatePassword)
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) reject(err)
      resolve(isMatch)
    })
  })
}

User.associate = (models: any) => {
  User.belongsTo(models.File, {
    foreignKey: 'avatar',
    as: 'Avatar',
  })
}

export default User
