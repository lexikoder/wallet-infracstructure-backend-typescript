import  {Wallet} from "../models/wallet"
import {tryCatch} from "../utils/tryCatch"
import {networks} from "../config/networks"
import {erc20Abi} from "../config/abi"
import  {
  client as clientint,
  readcontract,
  sendeth,
  senderc20,
} from "../utils/contractInteraction"
import { generateMnemonic, mnemonicToAccount } from "viem/accounts"
import  { wordlist } from "@scure/bip39/wordlists/english"
import  { privateKeyToAccount } from "viem/accounts"
import  {
  createWalletClient,
  parseUnits,
  http,
  bytesToHex,
} from "viem"
import { sepolia } from "viem/chains"
import {Request, Response, NextFunction} from 'express';
import { AppError } from "../utils/appError"
import { networktypeAPTOS, networktypeEVM, networktypeSOLANA } from "../config/networkConstants"






const createWallet = tryCatch(async (req:Request<{},{},{networktype:string}>, res:Response) => {
  const { networktype } = req.body;
  const mnemonic = generateMnemonic(wordlist);
  console.log("started")
  // const account = mnemonicToAccount(mnemonic);
  let account;
  const addresses = [];
  if (networktype === networktypeEVM) {

  for (let i = 0; i < 10; i++) {
    account = mnemonicToAccount(mnemonic, {
      path: `m/44'/60'/0'/0/${i}`, // N = i
    });
    addresses.push(account.address);
  }
  }

  if (networktype === networktypeSOLANA) {
    
  //todo
  }

  if (networktype === networktypeAPTOS) {
    
  //todo
  }

  let walletdata = {
    // ...data,
    address: addresses,
    network: networktype,
  };
  // const privatekey = bytesToHex(account.getHdKey().privateKey);
  const createdwallet = await Wallet.create(walletdata);
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
});

const getDefaultAddress = tryCatch(async (req:Request<{walletId:string},{},{}>, res:Response) => {
  const { walletId } = req.params;
  const getWalletDatabyid = await Wallet.findById(walletId);
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
});

const getAllAddress = tryCatch(async (req:Request<{walletId:string},{},{}>, res:Response) => {
  const { walletId } = req.params;
  const getWalletDatabyid = await Wallet.findById(walletId);
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
});

const getBalance = tryCatch(async (req:Request<{walletId:string},{},{},{walletId:string,token:string,_network:string}>, res:Response) => {
  const { walletId, token, _network } = req.query;
  const getWalletDatabyid = await Wallet.findById(walletId);
  if (!getWalletDatabyid) {
    return res.status(400).json({
      success: false,
      message: "no address found",
    });
  }
  const network = networks(getWalletDatabyid.networktype,_network);
  let balance;
  let decimal;
  let _token;
  const useraddress = getWalletDatabyid.address[0];
  const client = clientint(network);
  if (token === "ETH") {
    _token = "ETH";
    balance = await client.getBalance({ address: useraddress as `0x${string}` });
    decimal = 18;
  } else {
    balance = await readcontract(network, token, "balanceOf", [useraddress]);
    decimal = await readcontract(network, token, "decimals", []);
    _token = await readcontract(network, token, "name", []);
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
});

interface ITransfer {
  mnemonic:string; 
  walletId:string;
  token:string;
  fromaddress:string;
  toaddress:string;
  amount:string;
  _network:string;
}
const transferDefault = tryCatch(async (req:Request<{},{},ITransfer,{}>, res:Response) => {
  const { mnemonic, walletId, token, fromaddress, toaddress, amount ,_network} =
    req.body;

  const getWalletDatabyid = await Wallet.findById(walletId);
  if (!getWalletDatabyid) {
    return res.status(400).json({
      success: false,
      message: "no address found",
    });
  }
  const useraddress = getWalletDatabyid.address;
  const i = useraddress.indexOf(fromaddress);

  const mnemonictoaccount = mnemonicToAccount(mnemonic, {
    path: `m/44'/60'/0'/0/${i}`, // N = i
  });
  //   const privatekey = bytesToHex(account.getHdKey().privateKey);
  const hdKey = mnemonictoaccount.getHdKey(); // `account` must be defined already
  if (!hdKey.privateKey) {
  throw new AppError('Private key is missing', 400);
  }
  const privateKey = bytesToHex(hdKey.privateKey);
  const account = privateKeyToAccount(privateKey);
  const network = networks(getWalletDatabyid.networktype,_network);
  const client = createWalletClient({
    account,
    chain: network?.network,
    transport: http(network?.rpc), // or other RPC
  });

  let decimal;
  let _token;
  let hash;
  //  const client = clientint(network)
  if (token === "ETH") {
    _token = "ETH";
    decimal = 18;
    hash = await sendeth(network, account, toaddress, amount);
  } else {
    decimal = await readcontract(network, token, "decimals", [])
    _token = await readcontract(network, token, "name", []);
    const _amount = parseUnits(amount, Number(decimal));
    hash = await senderc20(
      network,
      token,
      erc20Abi,
      account,
      toaddress,
      _amount
    );
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
});

interface ITransferImportwallet {
  mnemonic:string; 
  token:string;
  fromaddress:string;
  toaddress:string;
  amount:string;
  networktype:string;
  _network:string;
}

const importwallettransferDefault = tryCatch(async (req:Request<{},{},ITransferImportwallet,{}>, res:Response) => {
  const { mnemonic,  token, fromaddress, toaddress, amount ,networktype,_network} =
    req.body;

  const mnemonictoaccount = mnemonicToAccount(mnemonic, {
    path: `m/44'/60'/0'/0/0`, // N = i
  });
  //   const privatekey = bytesToHex(account.getHdKey().privateKey);
  const hdKey = mnemonictoaccount.getHdKey(); // `account` must be defined already
  if (!hdKey.privateKey) {
  throw new AppError('Private key is missing', 400);
  }
  const privateKey = bytesToHex(hdKey.privateKey);         
  const account = privateKeyToAccount(privateKey); 
  const network = networks(networktype,_network);
  const client = createWalletClient({
    account,
    chain: network?.network,
    transport: http(network?.rpc), // or other RPC
  });

  let decimal;
  let _token;
  let hash;
  //  const client = clientint(network)
  if (token === "ETH") {
    _token = "ETH";
    decimal = 18;
    hash = await sendeth(network, account, toaddress, amount);
  } else {
    decimal = await readcontract(network, token, "decimals", [])
    _token = await readcontract(network, token, "name", []);
    const _amount = parseUnits(amount, Number(decimal));
    hash = await senderc20(
      network,
      token,
      erc20Abi,
      account,
      toaddress,
      _amount
    );
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
});

export  {
  createWallet,
  getDefaultAddress,
  getAllAddress,
  getBalance,
  transferDefault,
  importwallettransferDefault  
};
