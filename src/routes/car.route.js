import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { registerCar,
    
 } from "../controllers/car.controller.js"

const router = Router()

router.route("/register").post(verifyJWT,registerCar)

export default router