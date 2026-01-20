import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addProduct } from '../controllers/inventory.controller.js'

const router = Router()

router.route("/addProduct").post(verifyJWT,addProduct)

export default router