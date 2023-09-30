import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface CategoryAttributes {
  id: string
  title: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> { }

export interface CategoryInstance
  extends Model<CategoryAttributes, CategoryCreationAttributes>,
  CategoryAttributes { }

const Category = db.sequelize.define<CategoryInstance>(
  'Categories',
  {
    ...SequelizeAttributes.Categories,
  },
  { paranoid: true }
)

Category.associate = (models: any) => {
  // 
}

export default Category
