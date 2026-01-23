import {Router} from "express"
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {addMechanic} from '../controllers/mechanic.controller.js'

const router=Router();

router.route("/addMechanic").post(upload.single("profileImage"),verifyJWT,addMechanic);

export default router