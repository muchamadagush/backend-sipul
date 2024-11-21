import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface ScaleAttributes {
  id: string
  title: string
  createdAt?: Date
  updatedAt?: Date
}

interface ScaleCreationAttributes extends Optional<ScaleAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ScaleInstance
  extends Model<ScaleAttributes, ScaleCreationAttributes>,
  ScaleAttributes {}

const Scale = db.sequelize.define<ScaleInstance>(
  'Scales',
  {
    ...SequelizeAttributes.Scales,
  },
  { paranoid: false }
)

Scale.associate = (models: any) => {
  // 
}

export default Scale
