import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface PostCategoryAttributes {
  id: string
  postId: string
  categoryId: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface PostCategoryCreationAttributes extends Optional<PostCategoryAttributes, 'id'> { }

export interface PostCategoryInstance
  extends Model<PostCategoryAttributes, PostCategoryCreationAttributes>,
  PostCategoryAttributes { }

const PostCategory = db.sequelize.define<PostCategoryInstance>(
  'PostCategories',
  {
    ...SequelizeAttributes.PostCategories,
  },
  { paranoid: true }
)

PostCategory.associate = (models: any) => {
  // 
}

export default PostCategory
