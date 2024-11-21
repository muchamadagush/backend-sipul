import Type from './type'
import Scale from './scale'
import Product from './product'
import WeightScale from './weightscale'

const models = {
  Type,
  Scale,
  Product,
  WeightScale,
}

export default models

export type MyModels = typeof models

Object.entries(models).map(([, model]) => {
  if (model.associate) {
    model.associate(models)
  }
  return model
})
