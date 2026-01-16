import {Router} from "express";
import { registerUser,
        loginUser,
        updateUserProfile,
        logoutUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router=Router();
router.route("/register").post(upload.single("profileImage"),registerUser);
router.route("/login").post(loginUser)

//secure routes
router.route("/logout").get(verifyJWT,logoutUser)
router.route("/profileImage").patch(upload.single("profileImage"),verifyJWT,updateUserProfile)



export default router;