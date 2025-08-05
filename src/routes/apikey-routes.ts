import  express,{RequestHandler, Router} from "express"
import {decryptApikey} from "../controller/apikey-controller"
import {authMiddleware} from "../middleware/authentication-middleware"
const router: Router = express.Router()



router.get("/userapikey/:userId",authMiddleware as RequestHandler, decryptApikey)

  
  

export {router}