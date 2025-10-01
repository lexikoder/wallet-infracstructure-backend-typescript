"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networks = void 0;
const chains_1 = require("viem/chains");
const networkConstants_1 = require("./networkConstants");
const networks = (networktype, network) => {
    if (networktype === networkConstants_1.networktypeEVM) {
        if (network === networkConstants_1.networkSEPOLIA) {
            return { network: chains_1.sepolia, rpc: process.env.SEPOLIA_RPC };
        }
        if (network === networkConstants_1.networkBASESEPOLIA) {
            return { network: chains_1.baseSepolia, rpc: process.env.BASE_SEPOLIA_RPC };
        }
        if (network === networkConstants_1.networkETHEREUM) {
            return { network: chains_1.mainnet, rpc: process.env.ETHEREUM_RPC };
        }
        if (network === networkConstants_1.networkBASE) {
            return { network: chains_1.base, rpc: process.env.BASE_RPC };
        }
    }
};
exports.networks = networks;
