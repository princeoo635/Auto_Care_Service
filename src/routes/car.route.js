import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { registerCar,
    updateCar
 } from "../controllers/car.controller.js"

const router = Router()

router.route("/register").post(verifyJWT,registerCar)
router.route("/update/:carId").patch(verifyJWT,updateCar)

export default router