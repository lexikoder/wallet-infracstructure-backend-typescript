import mongoose from "mongoose"

const walletSchema = new mongoose.Schema({
    address:{
     type:[String],
     required:[true,"Wallet address is required"],
    },
    network:{
     type:String,
     enum:["SEPOLIA","ETHEREUM","BASE","BASESEPOLIA"],
     default:"SEPOLIA"
    }
})
const Wallet =mongoose.model("Wallet",walletSchema) 

export {Wallet}