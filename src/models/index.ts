import File from './file'
import User from './user'
import Category from './category'
import Post from './post'

const models = {
  File,
  User,
  Category,
  Post,
}

export default models

export type MyModels = typeof models

Object.entries(models).map(([, model]) => {
  if (model.associate) {
    model.associate(models)
  }
  return model
})
