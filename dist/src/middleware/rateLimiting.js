"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratelimitingGeneral = exports.ratelimitingOtp = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ratelimitingOtp = () => {
    return (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Allow only 5 attempts
        message: "Too many OTP attempts. Please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    });
};
exports.ratelimitingOtp = ratelimitingOtp;
const ratelimitingGeneral = (maxrequest, time) => {
    // this return a middleware
    return (0, express_rate_limit_1.default)({
        windowMs: time,
        max: maxrequest,
        message: "Too many attempts. Please try again later.",
        standardHeaders: true,
        legacyHeaders: false,
    });
};
exports.ratelimitingGeneral = ratelimitingGeneral;
