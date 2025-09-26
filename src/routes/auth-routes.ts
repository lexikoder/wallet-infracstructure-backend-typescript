import express, {RequestHandler, Router} from "express"
import  {reqOtp,verifyOtp,RegisterUser,LoginUser,refreshAccessToken,logout,decryptApikey} from "../controller/auth-controller"
import  {ratelimitingOtp} from "../middleware/rateLimiting"
import { authMiddleware } from "../middleware/authentication-middleware"
const router: Router = express.Router()


router.post("/reqotp",reqOtp)
// ratelimitingOtp() this is a function that returns a middleware thats why we call ratelimitingOtp() 
// if it was a middleware we just do ratelimitingOtp like this router.post("/verifyotp",ratelimitingOtp,verifyOtp)
router.post("/verifyotp",ratelimitingOtp(),verifyOtp)
router.post("/register",RegisterUser)
router.post("/login",LoginUser)
router.post("/refreshtoken",refreshAccessToken)
router.post("/logout",authMiddleware as RequestHandler,logout)

export {router}

