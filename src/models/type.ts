import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface TypeAttributes {
  id: string
  title: string
  createdAt?: Date
  updatedAt?: Date
}

interface TypeCreationAttributes extends Optional<TypeAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface TypeInstance
  extends Model<TypeAttributes, TypeCreationAttributes>,
  TypeAttributes {}

const Type = db.sequelize.define<TypeInstance>(
  'Types',
  {
    ...SequelizeAttributes.Types,
  },
  { paranoid: false }
)

Type.associate = (models: any) => {
  // 
}

export default Type
