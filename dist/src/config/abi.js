"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.erc20Abi = void 0;
const viem_1 = require("viem");
exports.erc20Abi = (0, viem_1.parseAbi)([
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address owner) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 value) returns (bool)',
    'function transfer(address to, uint256 value) returns (bool)',
    'function transferFrom(address from, address to, uint256 value) returns (bool)',
]);
// export  erc20Abi
