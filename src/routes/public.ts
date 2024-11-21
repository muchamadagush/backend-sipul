import express from 'express'

const router = express.Router()

export default router

require('../controllers/Type/type.controller')
require('../controllers/Scale/scale.controller')
require('../controllers/Product/product.controller')
require('../controllers/WeightScale/weightscale.controller')