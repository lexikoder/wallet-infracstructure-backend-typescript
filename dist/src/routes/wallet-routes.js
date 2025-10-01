"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("../controller/wallet-controller");
const validateApikey_1 = require("../middleware/validateApikey");
const subscriptionLimit_1 = require("../middleware/subscriptionLimit");
const router = express_1.default.Router();
exports.router = router;
router.post("/createwallet", validateApikey_1.apiKeyMiddleware, subscriptionLimit_1.subscriptionlimitMiddleware, wallet_controller_1.createWallet);
router.post("/createtransferdefault", validateApikey_1.apiKeyMiddleware, subscriptionLimit_1.subscriptionlimitMiddleware, wallet_controller_1.transferDefault);
router.post("/createtransferdefaultimportwallet", validateApikey_1.apiKeyMiddleware, subscriptionLimit_1.subscriptionlimitMiddleware, wallet_controller_1.importwallettransferDefault);
router.get("/getaddresses/:walletId", validateApikey_1.apiKeyMiddleware, subscriptionLimit_1.subscriptionlimitMiddleware, wallet_controller_1.getAllAddress);
router.get("/getdefaultaddress/:walletId", validateApikey_1.apiKeyMiddleware, subscriptionLimit_1.subscriptionlimitMiddleware, wallet_controller_1.getDefaultAddress);
router.get("/getbalance", validateApikey_1.apiKeyMiddleware, subscriptionLimit_1.subscriptionlimitMiddleware, wallet_controller_1.getBalance);
