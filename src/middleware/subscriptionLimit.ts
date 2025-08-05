import {SubscriptionApikey} from "../models/subscription-apikeys"
import  {planLimits} from "../config/apiKeyAccessConfig"
import  crypto from "crypto"
import { CustomRequestapikey } from "./validateApikey";
import { Response, NextFunction ,RequestHandler } from 'express';
const subscriptionlimitMiddleware = async (req:CustomRequestapikey, res:Response, next:NextFunction) => {
  try {
    const apiKey = req.apikey;
    const reqpath = req.originalUrl.split("?")[0];

    const hashedapikey = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex");
    const subapikey = await SubscriptionApikey.findOne({
      "apikey.hashedkey": hashedapikey,
    });

    const value = subapikey?.subscription?.apicount.find(
      (apicountval) => apicountval?.apitype === reqpath
    );
    
    const count = value?.count;
    if (!subapikey) {
      return res.status(401).json({
        success: false,
        message: "invalid api key",
      });
    }

    if (!subapikey?.subscription) {
      subapikey.subscription = {
        subscription: "free", // or "premium", depending on default
        apicount: [],
      };
    }
    // Date.now() + 30 * 24 * 60 * 60 * 1000  means 30 days from now
    if (!value) {
      subapikey.subscription.apicount.push({
        apitype: reqpath,
        count: 1,
        expiresat: Date.now() + 15 * 60 * 1000,
      });
      await subapikey.save();
      return next();
    }
    //@ts-ignore
    if (Date.now() > value.expiresat) {
      value.count = 1;
      value.expiresat = Date.now() + 15 * 60 * 1000;
      await subapikey.save();
      return next();
    }
    if (
      
      subapikey.subscription.subscription === "free" &&
      //@ts-ignore
      count >= planLimits["free"][reqpath]
    ) {
      return res.status(401).json({
        success: false,
        message: "exceeded your free tiral limit wait till 30 days ",
      });
    } else if (
      subapikey.subscription.subscription === "premium" &&
      //@ts-ignore
      count >= planLimits["premium"][reqpath]
    ) {
      return res.status(401).json({
        success: false,
        message: "exceeded your premium trial limit wait till 30 days ",
      });
    }
    value.count += 1;
    await subapikey.save();

    next();
  } catch (error) {
    next(error);
  }
};
export  {subscriptionlimitMiddleware}
