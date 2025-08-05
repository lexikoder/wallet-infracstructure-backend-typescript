import {SubscriptionApikey} from "../models/subscription-apikeys"
import {tryCatch} from "../utils/tryCatch"
import {AppError} from "../utils/appError"
import { decrypt } from "../utils/encrypt"
import {Request, Response, NextFunction} from 'express';

 
export const decryptApikey = tryCatch(async (req:Request<{userId:string}>, res:Response, next:NextFunction) => {
  const { userId } = req.params;

  const subapikey = await SubscriptionApikey.findOne({ user: userId });

  if (!subapikey) {
    throw new AppError("data not found", 404);
  }

  const apikey = decrypt(subapikey.apikey);

  return res
    .status(200)
    .json({
      success: true,
      message: "apikey decrypted",
      data: { apikey: apikey },
    });
});


