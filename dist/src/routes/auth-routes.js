"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controller/auth-controller");
const rateLimiting_1 = require("../middleware/rateLimiting");
const authentication_middleware_1 = require("../middleware/authentication-middleware");
const router = express_1.default.Router();
exports.router = router;
router.post("/reqotp", auth_controller_1.reqOtp);
// ratelimitingOtp() this is a function that returns a middleware thats why we call ratelimitingOtp() 
// if it was a middleware we just do ratelimitingOtp like this router.post("/verifyotp",ratelimitingOtp,verifyOtp)
router.post("/verifyotp", (0, rateLimiting_1.ratelimitingOtp)(), auth_controller_1.verifyOtp);
router.post("/register", auth_controller_1.RegisterUser);
router.post("/login", auth_controller_1.LoginUser);
router.post("/refreshtoken", auth_controller_1.refreshAccessToken);
router.post("/logout", authentication_middleware_1.authMiddleware, auth_controller_1.logout);
