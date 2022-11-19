import Project from './project'
import File from './file'

const models = {
  Project,
  File,
}

export default models

export type MyModels = typeof models

// Object.entries(models).map(([, model]) => {
//   if (model.associate) {
//     model.associate(models)
//   }
//   return model
// })
