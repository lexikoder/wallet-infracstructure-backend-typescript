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
exports.importwallettransferDefault = exports.transferDefault = exports.getBalance = exports.getAllAddress = exports.getDefaultAddress = exports.createWallet = void 0;
const wallet_1 = require("../models/wallet");
const tryCatch_1 = require("../utils/tryCatch");
const networks_1 = require("../config/networks");
const abi_1 = require("../config/abi");
const contractInteraction_1 = require("../utils/contractInteraction");
const accounts_1 = require("viem/accounts");
const english_1 = require("@scure/bip39/wordlists/english");
const accounts_2 = require("viem/accounts");
const viem_1 = require("viem");
const appError_1 = require("../utils/appError");
const networkConstants_1 = require("../config/networkConstants");
const createWallet = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { networktype } = req.body;
    const mnemonic = (0, accounts_1.generateMnemonic)(english_1.wordlist);
    console.log("started");
    // const account = mnemonicToAccount(mnemonic);
    let account;
    const addresses = [];
    if (networktype === networkConstants_1.networktypeEVM) {
        for (let i = 0; i < 10; i++) {
            account = (0, accounts_1.mnemonicToAccount)(mnemonic, {
                path: `m/44'/60'/0'/0/${i}`, // N = i
            });
            addresses.push(account.address);
        }
    }
    if (networktype === networkConstants_1.networktypeSOLANA) {
        //todo
    }
    if (networktype === networkConstants_1.networktypeAPTOS) {
        //todo
    }
    let walletdata = {
        // ...data,
        address: addresses,
        network: networktype,
    };
    // const privatekey = bytesToHex(account.getHdKey().privateKey);
    const createdwallet = yield wallet_1.Wallet.create(walletdata);
    if (createdwallet) {
        return res.status(201).json({
            success: true,
            message: "wallet created successfully",
            data: {
                walletId: createdwallet._id,
                walletAddress: createdwallet.address[0],
                network: createdwallet.networktype,
                mnemonic: mnemonic,
            },
        });
    }
}));
exports.createWallet = createWallet;
const getDefaultAddress = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.params;
    const getWalletDatabyid = yield wallet_1.Wallet.findById(walletId);
    if (!getWalletDatabyid) {
        return res.status(400).json({
            success: false,
            message: "no address found",
        });
    }
    return res.status(201).json({
        success: true,
        message: "successfull wallet address",
        data: getWalletDatabyid.address[0],
    });
}));
exports.getDefaultAddress = getDefaultAddress;
const getAllAddress = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId } = req.params;
    const getWalletDatabyid = yield wallet_1.Wallet.findById(walletId);
    if (!getWalletDatabyid) {
        return res.status(400).json({
            success: false,
            message: "no address found",
        });
    }
    return res.status(201).json({
        success: true,
        message: "successfully wallet addresses",
        data: getWalletDatabyid.address,
    });
}));
exports.getAllAddress = getAllAddress;
const getBalance = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletId, token, _network } = req.query;
    const getWalletDatabyid = yield wallet_1.Wallet.findById(walletId);
    if (!getWalletDatabyid) {
        return res.status(400).json({
            success: false,
            message: "no address found",
        });
    }
    const network = (0, networks_1.networks)(getWalletDatabyid.networktype, _network);
    let balance;
    let decimal;
    let _token;
    const useraddress = getWalletDatabyid.address[0];
    const client = (0, contractInteraction_1.client)(network);
    if (token === "ETH") {
        _token = "ETH";
        balance = yield client.getBalance({ address: useraddress });
        decimal = 18;
    }
    else {
        balance = yield (0, contractInteraction_1.readcontract)(network, token, "balanceOf", [useraddress]);
        decimal = yield (0, contractInteraction_1.readcontract)(network, token, "decimals", []);
        _token = yield (0, contractInteraction_1.readcontract)(network, token, "name", []);
    }
    return res.status(201).json({
        success: true,
        message: "Successfully fetched wallet balance",
        data: {
            address: useraddress,
            network: getWalletDatabyid.networktype,
            balance: balance.toString(),
            decimal: decimal,
            token: _token,
        },
    });
}));
exports.getBalance = getBalance;
const transferDefault = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mnemonic, walletId, token, fromaddress, toaddress, amount, _network } = req.body;
    const getWalletDatabyid = yield wallet_1.Wallet.findById(walletId);
    if (!getWalletDatabyid) {
        return res.status(400).json({
            success: false,
            message: "no address found",
        });
    }
    const useraddress = getWalletDatabyid.address;
    const i = useraddress.indexOf(fromaddress);
    const mnemonictoaccount = (0, accounts_1.mnemonicToAccount)(mnemonic, {
        path: `m/44'/60'/0'/0/${i}`, // N = i
    });
    //   const privatekey = bytesToHex(account.getHdKey().privateKey);
    const hdKey = mnemonictoaccount.getHdKey(); // `account` must be defined already
    if (!hdKey.privateKey) {
        throw new appError_1.AppError('Private key is missing', 400);
    }
    const privateKey = (0, viem_1.bytesToHex)(hdKey.privateKey);
    const account = (0, accounts_2.privateKeyToAccount)(privateKey);
    const network = (0, networks_1.networks)(getWalletDatabyid.networktype, _network);
    const client = (0, viem_1.createWalletClient)({
        account,
        chain: network === null || network === void 0 ? void 0 : network.network,
        transport: (0, viem_1.http)(network === null || network === void 0 ? void 0 : network.rpc), // or other RPC
    });
    let decimal;
    let _token;
    let hash;
    //  const client = clientint(network)
    if (token === "ETH") {
        _token = "ETH";
        decimal = 18;
        hash = yield (0, contractInteraction_1.sendeth)(network, account, toaddress, amount);
    }
    else {
        decimal = yield (0, contractInteraction_1.readcontract)(network, token, "decimals", []);
        _token = yield (0, contractInteraction_1.readcontract)(network, token, "name", []);
        const _amount = (0, viem_1.parseUnits)(amount, Number(decimal));
        hash = yield (0, contractInteraction_1.senderc20)(network, token, abi_1.erc20Abi, account, toaddress, _amount);
    }
    return res.status(201).json({
        success: true,
        message: "Successfully transfered token",
        data: {
            fromaddress,
            toaddress,
            amount,
            decimal,
            token: _token,
            hash,
        },
    });
}));
exports.transferDefault = transferDefault;
const importwallettransferDefault = (0, tryCatch_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mnemonic, token, fromaddress, toaddress, amount, networktype, _network } = req.body;
    const mnemonictoaccount = (0, accounts_1.mnemonicToAccount)(mnemonic, {
        path: `m/44'/60'/0'/0/0`, // N = i
    });
    //   const privatekey = bytesToHex(account.getHdKey().privateKey);
    const hdKey = mnemonictoaccount.getHdKey(); // `account` must be defined already
    if (!hdKey.privateKey) {
        throw new appError_1.AppError('Private key is missing', 400);
    }
    const privateKey = (0, viem_1.bytesToHex)(hdKey.privateKey);
    const account = (0, accounts_2.privateKeyToAccount)(privateKey);
    const network = (0, networks_1.networks)(networktype, _network);
    const client = (0, viem_1.createWalletClient)({
        account,
        chain: network === null || network === void 0 ? void 0 : network.network,
        transport: (0, viem_1.http)(network === null || network === void 0 ? void 0 : network.rpc), // or other RPC
    });
    let decimal;
    let _token;
    let hash;
    //  const client = clientint(network)
    if (token === "ETH") {
        _token = "ETH";
        decimal = 18;
        hash = yield (0, contractInteraction_1.sendeth)(network, account, toaddress, amount);
    }
    else {
        decimal = yield (0, contractInteraction_1.readcontract)(network, token, "decimals", []);
        _token = yield (0, contractInteraction_1.readcontract)(network, token, "name", []);
        const _amount = (0, viem_1.parseUnits)(amount, Number(decimal));
        hash = yield (0, contractInteraction_1.senderc20)(network, token, abi_1.erc20Abi, account, toaddress, _amount);
    }
    return res.status(201).json({
        success: true,
        message: "Successfully transfered token",
        data: {
            fromaddress,
            toaddress,
            amount,
            decimal,
            token: _token,
            hash,
        },
    });
}));
exports.importwallettransferDefault = importwallettransferDefault;
