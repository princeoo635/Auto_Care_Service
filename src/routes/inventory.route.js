import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addProduct, updateProductDetails, deleteProduct } from '../controllers/inventory.controller.js'

const router = Router()

router.route("/addProduct").post(verifyJWT,addProduct)
router.route("/updateProduct/:productId").patch(verifyJWT,updateProductDetails)
router.route("/deleteProduct/:productId").delete(verifyJWT,deleteProduct)

export default router