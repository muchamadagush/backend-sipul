import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface ProductAttributes {
  id: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

export interface ProductInstance
  extends Model<ProductAttributes, ProductCreationAttributes>,
  ProductAttributes {}

const Product = db.sequelize.define<ProductInstance>(
  'Products',
  {
    ...SequelizeAttributes.Products,
  },
  { paranoid: true }
)

Product.associate = (models: any) => {
  // 
}

export default Product
