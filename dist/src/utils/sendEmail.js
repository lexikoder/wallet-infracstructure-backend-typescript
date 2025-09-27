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
exports.nodemailerOtp = exports.nodemailerResetLink = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const otpTemplates_1 = require("../emailTemplates/otpTemplates");
const resetLinkTemplates_1 = require("../emailTemplates/resetLinkTemplates");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const EMAIL = process.env.EMAIL;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;
if (!EMAIL) {
    throw new Error('EMAIL and EMAIL_APP_PASSWORD is missing');
}
const nodemailerResetLink = (toemailaddress, username, resetLink, expires) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: EMAIL,
                pass: EMAIL_APP_PASSWORD,
            },
        });
        const info = yield transporter.sendMail({
            from: { name: "Admin", address: EMAIL },
            to: toemailaddress,
            subject: "Reset Password",
            html: (0, resetLinkTemplates_1.resetLinkTemplate)(username, resetLink, expires), // HTML body
        });
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.nodemailerResetLink = nodemailerResetLink;
const nodemailerOtp = (toemailaddress, otp, expires) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: EMAIL,
                pass: EMAIL_APP_PASSWORD,
            },
        });
        const info = yield transporter.sendMail({
            from: { name: "Admin", address: EMAIL },
            to: toemailaddress,
            subject: "OTP Verification",
            html: (0, otpTemplates_1.generateOtpEmail)("user", otp, expires), // HTML body
        });
    }
    catch (e) {
        console.log(e);
        throw e;
    }
});
exports.nodemailerOtp = nodemailerOtp;
