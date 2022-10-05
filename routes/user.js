import express from "express"
import passport from "passport"
import {myProfile,logout, getAdminUsers, getAdminStats} from "../controllers/userController.js"
import { authorizeAdmin, isAuthenticated } from "../middlewares/isAuthenticated.js"
const router = express.Router()
router.get("/googleauth",passport.authenticate("google",{
    scope:["profile"]
}))

router.get("/login",passport.authenticate("google",{
    
    successRedirect : process.env.FRONTEND_URL
}))

router.get("/me",isAuthenticated,myProfile)

router.get("/logout",logout)

router.get("/admin/users",isAuthenticated,authorizeAdmin,getAdminUsers)
router.get("/admin/stats",isAuthenticated,authorizeAdmin,getAdminStats)
export default router

