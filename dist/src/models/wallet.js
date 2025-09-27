"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const walletSchema = new mongoose_1.default.Schema({
    address: {
        type: [String],
        required: [true, "Wallet address is required"],
    },
    networktype: {
        type: String,
        enum: ["EVM", "SOLANA", "APTOS"],
        default: "EVM"
    }
    // network:{
    //  type:String,
    //  enum:["SEPOLIA","ETHEREUM","BASE","BASESEPOLIA"],
    //  default:"SEPOLIA"
    // }
});
const Wallet = mongoose_1.default.model("Wallet", walletSchema);
exports.Wallet = Wallet;
