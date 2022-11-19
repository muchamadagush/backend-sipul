import { Model, Optional, DataTypes } from 'sequelize'
import { BASE_URL_SERVER } from '../config/baseServer'

import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface FileAttributes {
  id: string
  filename: string
  type: string
  path: string
  createdAt?: Date
  updatedAt?: Date
}

interface FileCreationAttributes extends Optional<FileAttributes, 'id'> {}

export interface FileInstance
  extends Model<FileAttributes, FileCreationAttributes>,
    FileAttributes {}

const File = db.sequelize.define<FileInstance>(
  'Files',
  {
    ...SequelizeAttributes.Files,
    url: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING),
      get(field: string): string {
        if (field !== 'url') return 'about:blank'
        return `${BASE_URL_SERVER}${this.get('path')}`
      },
    },
  },
  { paranoid: false }
)

export default File
