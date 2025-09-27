"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const apikey_controller_1 = require("../controller/apikey-controller");
const authentication_middleware_1 = require("../middleware/authentication-middleware");
const router = express_1.default.Router();
exports.router = router;
router.get("/userapikey/:userId", authentication_middleware_1.authMiddleware, apikey_controller_1.decryptApikey);
