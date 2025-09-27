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
exports.apiKeyMiddleware = void 0;
const subscription_apikeys_1 = require("../models/subscription-apikeys");
const crypto_1 = __importDefault(require("crypto"));
const apiKeyMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawApiKey = req.headers["x-api-key"];
        if (!rawApiKey) {
            return res.status(401).json({
                success: false,
                message: "access denied no apikey provided.please try again",
            });
        }
        const apiKey = Array.isArray(rawApiKey) ? rawApiKey[0] : rawApiKey;
        const hashedapikey = crypto_1.default.createHash("sha256").update(apiKey).digest("hex");
        const subapikey = yield subscription_apikeys_1.SubscriptionApikey.findOne({
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
    }
    catch (error) {
        next(error);
    }
});
exports.apiKeyMiddleware = apiKeyMiddleware;
