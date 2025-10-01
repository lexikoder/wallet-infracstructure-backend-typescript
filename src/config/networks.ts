import { mainnet,base,baseSepolia,sepolia } from 'viem/chains'
import { networkBASE, networkBASESEPOLIA, networkETHEREUM, networkSEPOLIA, networktypeEVM } from './networkConstants'


export const networks = (networktype:string,network:string) =>{
  if (networktype === networktypeEVM) {
   if(network === networkSEPOLIA){
     return {network:sepolia,rpc:process.env.SEPOLIA_RPC}
   }
   if(network === networkBASESEPOLIA){
     return {network:baseSepolia,rpc:process.env.BASE_SEPOLIA_RPC}
   }
   if(network === networkETHEREUM){
     return {network:mainnet,rpc:process.env.ETHEREUM_RPC} 
   }
   if(network === networkBASE){
     return  {network:base,rpc:process.env.BASE_RPC}    
   }
   }
}  
