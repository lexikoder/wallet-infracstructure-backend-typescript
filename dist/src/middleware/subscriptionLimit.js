"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionlimitMiddleware = void 0;
const subscription_apikeys_1 = require("../models/subscription-apikeys");
const apiKeyAccessConfig_1 = require("../config/apiKeyAccessConfig");
const crypto_1 = __importDefault(require("crypto"));
const subscriptionlimitMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const apiKey = req.apikey;
        const reqpath = req.originalUrl.split("?")[0];
        const hashedapikey = crypto_1.default
            .createHash("sha256")
            .update(apiKey)
            .digest("hex");
        const subapikey = yield subscription_apikeys_1.SubscriptionApikey.findOne({
            "apikey.hashedkey": hashedapikey,
        });
        const value = (_a = subapikey === null || subapikey === void 0 ? void 0 : subapikey.subscription) === null || _a === void 0 ? void 0 : _a.apicount.find((apicountval) => (apicountval === null || apicountval === void 0 ? void 0 : apicountval.apitype) === reqpath);
        const count = value === null || value === void 0 ? void 0 : value.count;
        if (!subapikey) {
            return res.status(401).json({
                success: false,
                message: "invalid api key",
            });
        }
        if (!(subapikey === null || subapikey === void 0 ? void 0 : subapikey.subscription)) {
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
            yield subapikey.save();
            return next();
        }
        //@ts-ignore
        if (Date.now() > value.expiresat) {
            value.count = 1;
            value.expiresat = Date.now() + 15 * 60 * 1000;
            yield subapikey.save();
            return next();
        }
        if (subapikey.subscription.subscription === "free" &&
            //@ts-ignore
            count >= apiKeyAccessConfig_1.planLimits["free"][reqpath]) {
            return res.status(401).json({
                success: false,
                message: "exceeded your free tiral limit wait till 30 days ",
            });
        }
        else if (subapikey.subscription.subscription === "premium" &&
            //@ts-ignore
            count >= apiKeyAccessConfig_1.planLimits["premium"][reqpath]) {
            return res.status(401).json({
                success: false,
                message: "exceeded your premium trial limit wait till 30 days ",
            });
        }
        value.count += 1;
        yield subapikey.save();
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.subscriptionlimitMiddleware = subscriptionlimitMiddleware;
