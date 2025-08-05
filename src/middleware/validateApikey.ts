import  {SubscriptionApikey} from "../models/subscription-apikeys"
import  crypto from "crypto"
import { Request, Response, NextFunction } from 'express';
export interface CustomRequestapikey extends Request {
   apikey:string
}
const apiKeyMiddleware = async (req:CustomRequestapikey , res:Response, next:NextFunction) => {
  try {
    const rawApiKey = req.headers["x-api-key"];

    if (!rawApiKey) {
      return res.status(401).json({
        success: false,
        message: "access denied no apikey provided.please try again",
      });
    }
    const apiKey = Array.isArray(rawApiKey) ? rawApiKey[0] : rawApiKey;
    const hashedapikey = crypto.createHash("sha256").update(apiKey).digest("hex");

    const subapikey = await SubscriptionApikey.findOne({
      "apikey.hashedkey": hashedapikey,
    });

    if (!subapikey) {
      return res.status(401).json({
        success: false,
        message: "data not found",
      });
    }
    req.apikey = apiKey;
    next();
  } catch (error) {
    next(error);
  }
};
export {apiKeyMiddleware}    
