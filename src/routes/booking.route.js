import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createBooking,
    assignMechanic,
    addPartsUsed,
    completeService
 } from "../controllers/booking.controller.js"

const router = Router()

router.route("/booking").post(verifyJWT,createBooking)
router.route("/assign-mechanic/:bookingId").patch(verifyJWT,assignMechanic)
router.route("/add-part/:bookingId").patch(verifyJWT,addPartsUsed)
router.route("/complete/:bookingId").patch(verifyJWT,completeService)

export default router