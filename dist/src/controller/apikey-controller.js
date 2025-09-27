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
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptApikey = void 0;
const subscription_apikeys_1 = require("../models/subscription-apikeys");
const tryCatch_1 = require("../utils/tryCatch");
const appError_1 = require("../utils/appError");
const encrypt_1 = require("../utils/encrypt");
exports.decryptApikey = (0, tryCatch_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const subapikey = yield subscription_apikeys_1.SubscriptionApikey.findOne({ user: userId });
    if (!subapikey) {
        throw new appError_1.AppError("data not found", 404);
    }
    const apikey = (0, encrypt_1.decrypt)(subapikey.apikey);
    return res
        .status(200)
        .json({
        success: true,
        message: "apikey decrypted",
        data: { apikey: apikey },
    });
}));
