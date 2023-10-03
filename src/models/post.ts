import { Model, Optional } from 'sequelize'
import SequelizeAttributes from '../utils/SequelizeAttributes'

import db from './_instance'

export interface PostAttributes {
  id: string
  title: string
  description: string
  slug: string
  status: string
  thumbnail: string | null
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

interface PostCreationAttributes extends Optional<PostAttributes, 'id'> { }

export interface PostInstance
  extends Model<PostAttributes, PostCreationAttributes>,
  PostAttributes { }

const Post = db.sequelize.define<PostInstance>(
  'Posts',
  {
    ...SequelizeAttributes.Posts,
  },
  { paranoid: true }
)

Post.associate = (models: any) => {
  // 
}

export default Post
