import  express, {RequestHandler, Router} from "express"

import  {createWallet,getAllAddress,getDefaultAddress,getBalance,transferDefault, importwallettransferDefault} from "../controller/wallet-controller"
import {apiKeyMiddleware} from "../middleware/validateApikey"
import {subscriptionlimitMiddleware} from "../middleware/subscriptionLimit"

const router: Router = express.Router()
router.post("/createwallet",apiKeyMiddleware as RequestHandler,subscriptionlimitMiddleware as RequestHandler , createWallet);
router.post("/createtransferdefault",apiKeyMiddleware as RequestHandler,subscriptionlimitMiddleware as RequestHandler,transferDefault);
router.post("/createtransferdefaultimportwallet",apiKeyMiddleware as RequestHandler,subscriptionlimitMiddleware as RequestHandler,importwallettransferDefault);
router.get("/getaddresses/:walletId",apiKeyMiddleware as RequestHandler,subscriptionlimitMiddleware as RequestHandler,getAllAddress);  
router.get("/getdefaultaddress/:walletId",apiKeyMiddleware as RequestHandler,subscriptionlimitMiddleware as RequestHandler,getDefaultAddress); 
router.get("/getbalance",apiKeyMiddleware as RequestHandler,subscriptionlimitMiddleware as RequestHandler,getBalance); 
   
export  {router}           