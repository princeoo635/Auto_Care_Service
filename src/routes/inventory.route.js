import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addProduct, updateProductDetails } from '../controllers/inventory.controller.js'

const router = Router()

router.route("/addProduct").post(verifyJWT,addProduct)
router.route("/updateProduct/:productId").patch(verifyJWT,updateProductDetails)

export default router