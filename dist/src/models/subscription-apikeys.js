"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionApikey = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const apiTypeSchema = new mongoose_1.default.Schema({
    apitype: {
        type: String,
    },
    count: {
        type: Number,
        default: 0
    },
    expiresat: {
        type: Number,
        // default: () => {
        //     // putting this in a function allows this to not run when the schema is defined it should only run when document is created
        //     return Date.now() + 30 * 24 * 60 * 60 * 1000} // 30 days from now
    }
}, { _id: false });
const subscriptionCountSchema = new mongoose_1.default.Schema({
    subscription: {
        type: String,
        enum: ["free", "premium"],
        default: "free"
    },
    apicount: [apiTypeSchema]
}, { _id: false });
const encryptedkeySchema = new mongoose_1.default.Schema({
    iv: {
        type: String,
    },
    encryptedkey: {
        type: String,
    },
    hashedkey: {
        type: String
    }
}, { _id: false });
const subscriptionApikeySchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: "User",
        required: [true, "userId is  required"],
        unique: true
    },
    apikey: encryptedkeySchema,
    subscription: subscriptionCountSchema
}, { timestamps: true });
const SubscriptionApikey = mongoose_1.default.model("SubscriptionApikey", subscriptionApikeySchema);
exports.SubscriptionApikey = SubscriptionApikey;
