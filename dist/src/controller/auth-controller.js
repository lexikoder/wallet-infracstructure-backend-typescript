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
exports.logout = exports.refreshAccessToken = exports.LoginUser = exports.RegisterUser = exports.decryptApikey = exports.verifyOtp = exports.reqOtp = void 0;
const user_1 = require("../models/user");
const subscription_apikeys_1 = require("../models/subscription-apikeys");
const refreshToken_1 = require("../models/refreshToken");
const sendEmail_1 = require("../utils/sendEmail");
const generateOtp_1 = require("../utils/generateOtp");
const tryCatch_1 = require("../utils/tryCatch");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("../utils/appError");
const uuid_1 = require("uuid");
const encrypt_1 = require("../utils/encrypt");
const crypto_1 = __importDefault(require("crypto"));
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is missing");
}
const acesstokenpiration = 1; //in minutes
const refreshtokenpiration = 1; //in days
const otpCache = {};
const reqOtp = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    if (!email) {
        throw new appError_1.AppError("missing required field", 400);
    }
    const otp = (0, generateOtp_1.generateOTP)();
    //     // this is stored like this{"myeamail@gmail.com":{
    //   otp: otp,
    //   expiresAt: Date.now() + expirytimeinminutes * 60 * 1000, // 10 minutes
    //   verified: false
    // }}
    const expirytimeinminutes = 10;
    otpCache[email] = {
        otp: otp,
        expiresAt: Date.now() + expirytimeinminutes * 60 * 1000, // 10 minutes
        verified: false,
    };
    console.log(otp);
    yield (0, sendEmail_1.nodemailerOtp)(email, otp, expirytimeinminutes);
    console.log(otp);
    res.status(200).json({
        success: true,
        message: "otp sent successfully",
    });
}));
exports.reqOtp = reqOtp;
const verifyOtp = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (!otpCache.hasOwnProperty(email)) {
        throw new appError_1.AppError("otp not yet requested", 400);
    }
    if (Date.now() > otpCache[email].expiresAt) {
        delete otpCache[email];
        throw new appError_1.AppError("OTP expired", 400);
    }
    if (otpCache[email].verified === true) {
        throw new appError_1.AppError("OTP verified", 400);
    }
    if (otpCache[email].otp === otp.trim()) {
        // delete otpCache[email] should occur when you register
        otpCache[email].verified = true;
        return res.status(200).json({
            success: true,
            message: "otp verified successfuly",
        });
    }
    else {
        throw new appError_1.AppError("Invalid Otp", 400);
    }
}));
exports.verifyOtp = verifyOtp;
// Register endpoint
const RegisterUser = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userData = req.body;
    if (!userData.password || !userData.username || !userData.email) {
        throw new appError_1.AppError("missing required field", 400);
    }
    const checkUserNameExist = yield user_1.User.findOne({
        username: userData === null || userData === void 0 ? void 0 : userData.username,
    });
    const checkEmailExist = yield user_1.User.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email });
    if (checkUserNameExist || checkEmailExist) {
        throw new appError_1.AppError("email or password already exist", 404);
    }
    if (!otpCache[userData.email] || !((_a = otpCache[userData.email]) === null || _a === void 0 ? void 0 : _a.verified)) {
        throw new appError_1.AppError("Email not verified with OTP", 400);
    }
    delete otpCache[userData.email];
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(userData === null || userData === void 0 ? void 0 : userData.password, salt);
    let apikey = (0, uuid_1.v4)();
    const encryptedData = (0, encrypt_1.encrypt)(apikey);
    const hashedapikey = crypto_1.default.createHash("sha256").update(apikey).digest("hex");
    const encryptapikey = {
        iv: encryptedData.iv,
        encryptedkey: encryptedData.encryptedkey,
        hashedkey: hashedapikey,
    };
    let NewUserData = Object.assign(Object.assign({}, userData), { password: hashedPassword });
    const newlycreatedUser = yield user_1.User.create(NewUserData);
    const createnewuser = yield subscription_apikeys_1.SubscriptionApikey.create({
        user: newlycreatedUser._id,
        apikey: encryptapikey,
    });
    if (newlycreatedUser && createnewuser) {
        return res.status(201).json({
            success: true,
            message: "created successfully",
        });
    }
}));
exports.RegisterUser = RegisterUser;
// Login end point
const LoginUser = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const checkUserNameExist = yield user_1.User.findOne({ username: username });
    if (!checkUserNameExist) {
        throw new appError_1.AppError("Invalid credentials", 400);
    }
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, checkUserNameExist === null || checkUserNameExist === void 0 ? void 0 : checkUserNameExist.password);
    if (!isPasswordMatch) {
        throw new appError_1.AppError("Invalid credentials", 400);
    }
    const userInfo = {
        userId: checkUserNameExist._id,
        username: checkUserNameExist.username,
        role: checkUserNameExist.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(userInfo, JWT_SECRET_KEY, {
        expiresIn: `${acesstokenpiration}m`,
    });
    const refreshToken = jsonwebtoken_1.default.sign({
        userId: checkUserNameExist._id,
    }, JWT_SECRET_KEY, {
        expiresIn: `${refreshtokenpiration}d`,
    });
    yield refreshToken_1.refreshTokendb.create({
        token: refreshToken,
        user: checkUserNameExist._id,
        //expires in 1 day
        // 1 * 24 * 60 * 60 * 1000
        expiresAt: new Date(Date.now() + 3 * 60 * 1000),
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: acesstokenpiration * 60 * 1000, // in  minutes
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: refreshtokenpiration * 24 * 60 * 60 * 1000, // in  days
    });
    return res.status(201).json({
        success: true,
        message: "logged in successfully",
        // accessToken: accessToken,
        // refreshToken: refreshToken
    });
}));
exports.LoginUser = LoginUser;
const refreshAccessToken = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new appError_1.AppError("Refresh token not provided", 401);
    }
    const storedToken = yield refreshToken_1.refreshTokendb.findOne({ token: refreshToken });
    if (!storedToken) {
        throw new appError_1.AppError("Invalid refresh token", 403);
    }
    const { userId } = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET_KEY);
    // 3. Find user and generate new access token
    const user = yield user_1.User.findById(userId);
    if (!user) {
        throw new appError_1.AppError("User not found", 404);
    }
    const accessToken = jsonwebtoken_1.default.sign({
        userId: user._id,
        username: user.username,
        role: user.role,
    }, JWT_SECRET_KEY, {
        expiresIn: `${acesstokenpiration}m`,
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: acesstokenpiration * 60 * 1000, // in  minutes
    });
    return res.status(201).json({
        success: true,
        message: "Accesstoken generated",
        // accessToken: accessToken,
    });
}));
exports.refreshAccessToken = refreshAccessToken;
const logout = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        yield refreshToken.deleteOne({ token: refreshToken });
    }
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
}));
exports.logout = logout;
const decryptApikey = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params;
    const subapikey = yield subscription_apikeys_1.SubscriptionApikey.findById(userId);
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
exports.decryptApikey = decryptApikey;
