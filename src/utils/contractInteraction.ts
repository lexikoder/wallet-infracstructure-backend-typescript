import {createPublicClient, http,parseEther,createWalletClient } from 'viem' 
import  {erc20Abi} from "../config/abi"

const client = (network:any) =>{
const client = createPublicClient({
         chain: network.network, 
         transport: http(network.rpc), 
     }); 
  return client
}

const readcontract = async (network:any,token:any,funcName:any,args:any) =>{
const client = createPublicClient({
         chain: network.network, 
         transport: http(network.rpc), 
     });
const result = await client.readContract({
      address: token,
      abi: erc20Abi,
      functionName: funcName,
      args: args,
    }) 
  return result 
}

const sendeth = async (network:any,account:any,toaddress:any,amount:any) =>{
const client = createWalletClient({
      account,
      chain: network.network,
      transport: http(network.rpc), // or other RPC
    });
const result = await client.sendTransaction({
        account,
        to: toaddress,
        value: parseEther(amount), // 0.01 ETH
        gas: BigInt(21000),
        chain: network.network
        // gasPrice: currentGasPrice,
      });
  return result 
}

const senderc20 = async (network:any,token:any,erc20Abi:any,account:any,toaddress:any,_amount:any) =>{
const client = createWalletClient({
      account,
      chain: network.network,
      transport: http(network.rpc), // or other RPC
    });
const result = await client.writeContract({
        account,
        address: token ,
        abi: erc20Abi,
        functionName: "transfer",
        args: [toaddress, _amount],
        chain: network.network,
      });
  return result 
}

export  {client,readcontract,sendeth,senderc20}