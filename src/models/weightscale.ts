import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface WeightScaleAttributes {
  id: string
  ProductId?: string | null
  ScaleId: string
  weight: number
  createdAt?: Date
  updatedAt?: Date
}

interface WeightScaleCreationAttributes extends Optional<WeightScaleAttributes, 'id'> {}

export interface WeightScaleInstance
  extends Model<WeightScaleAttributes, WeightScaleCreationAttributes>,
  WeightScaleAttributes {}

const WeightScale = db.sequelize.define<WeightScaleInstance>(
  'WeightScales',
  {
    ...SequelizeAttributes.WeightScales,
  },
  { paranoid: false }
)

WeightScale.associate = (models: any) => {
  // 
}

export default WeightScale
