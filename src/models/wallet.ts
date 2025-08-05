import mongoose from "mongoose"

const walletSchema = new mongoose.Schema({
    address:{
     type:[String],
     required:[true,"Wallet address is required"],
    },
    network:{
     type:String,
     enum:["Sepolia","Ethereum","Base","BaseSepolia"],
     default:"Sepolia"
    }
})
const Wallet =mongoose.model("Wallet",walletSchema) 

export {Wallet}