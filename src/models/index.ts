import Project from './project'

const models = {
  Project,
}

export default models

export type MyModels = typeof models

// Object.entries(models).map(([, model]) => {
//   if (model.associate) {
//     model.associate(models)
//   }
//   return model
// })
