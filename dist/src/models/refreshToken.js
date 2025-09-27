"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokendb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const refreshTokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String,
        required: [true, "token required"],
        unique: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: "User",
        required: [true, "userId is  required"],
    },
    expiresAt: {
        type: Date,
        required: [true, "expiredAt is required"],
    }
}, { timestamps: true });
// this auto deletes the expired token document
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const refreshTokendb = mongoose_1.default.model("refreshToken", refreshTokenSchema);
exports.refreshTokendb = refreshTokendb;
