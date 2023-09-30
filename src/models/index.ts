import File from './file'
import User from './user'
import Category from './category'

const models = {
  File,
  User,
  Category,
}

export default models

export type MyModels = typeof models

Object.entries(models).map(([, model]) => {
  if (model.associate) {
    model.associate(models)
  }
  return model
})
