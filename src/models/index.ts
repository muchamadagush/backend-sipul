import File from './file'
import User from './user'

const models = {
  File,
  User,
}

export default models

export type MyModels = typeof models

Object.entries(models).map(([, model]) => {
  if (model.associate) {
    model.associate(models)
  }
  return model
})
