import express from 'express'

const router = express.Router()

export default router

require('../controllers/Upload/upload.controller')
require('../controllers/User/user.controller')
require('../controllers/Auth/auth.controller')
require('../controllers/Category/category.controller')
require('../controllers/Post/post.controller')