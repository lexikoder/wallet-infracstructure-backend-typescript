import { mainnet,base,baseSepolia,sepolia } from 'viem/chains'


export const networks = (network:string) =>{
   if(network === "SEPOLIA"){
     return {network:sepolia,rpc:process.env.SEPOLIA_RPC}
   }
   if(network === "BASESEPOLIA"){
     return {network:baseSepolia,rpc:process.env.BASE_SEPOLIA_RPC}
   }
   if(network === "ETHEREUM"){
     return {network:mainnet,rpc:process.env.ETHEREUM_RPC} 
   }
   if(network === "BASE"){
     return  {network:base,rpc:process.env.BASE_RPC}    
   }
}
