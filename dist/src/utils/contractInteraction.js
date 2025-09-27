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
Object.defineProperty(exports, "__esModule", { value: true });
exports.senderc20 = exports.sendeth = exports.readcontract = exports.client = void 0;
const viem_1 = require("viem");
const abi_1 = require("../config/abi");
const client = (network) => {
    const client = (0, viem_1.createPublicClient)({
        chain: network.network,
        transport: (0, viem_1.http)(network.rpc),
    });
    return client;
};
exports.client = client;
const readcontract = (network, token, funcName, args) => __awaiter(void 0, void 0, void 0, function* () {
    const client = (0, viem_1.createPublicClient)({
        chain: network.network,
        transport: (0, viem_1.http)(network.rpc),
    });
    const result = yield client.readContract({
        address: token,
        abi: abi_1.erc20Abi,
        functionName: funcName,
        args: args,
    });
    return result;
});
exports.readcontract = readcontract;
const sendeth = (network, account, toaddress, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const client = (0, viem_1.createWalletClient)({
        account,
        chain: network.network,
        transport: (0, viem_1.http)(network.rpc), // or other RPC
    });
    const result = yield client.sendTransaction({
        account,
        to: toaddress,
        value: (0, viem_1.parseEther)(amount), // 0.01 ETH
        gas: BigInt(21000),
        chain: network.network
        // gasPrice: currentGasPrice,
    });
    return result;
});
exports.sendeth = sendeth;
const senderc20 = (network, token, erc20Abi, account, toaddress, _amount) => __awaiter(void 0, void 0, void 0, function* () {
    const client = (0, viem_1.createWalletClient)({
        account,
        chain: network.network,
        transport: (0, viem_1.http)(network.rpc), // or other RPC
    });
    const result = yield client.writeContract({
        account,
        address: token,
        abi: erc20Abi,
        functionName: "transfer",
        args: [toaddress, _amount],
        chain: network.network,
    });
    return result;
});
exports.senderc20 = senderc20;
