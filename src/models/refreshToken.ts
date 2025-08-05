import mongoose from "mongoose"

const refreshTokenSchema = new mongoose.Schema({
    token:{
     type:String,
     required:[true,"token required"],
     unique:true,
    },
    user:{
     type: mongoose.Schema.Types.ObjectId, ref: "User", 
     required:[true,"userId is  required"],
    },
    expiresAt:{
     type:Date,
     required:[true,"expiredAt is required"],
    }
},{timestamps:true})
 
// this auto deletes the expired token document
refreshTokenSchema.index({expiresAt:1},{expireAfterSeconds:0})
const refreshTokendb =mongoose.model("refreshToken",refreshTokenSchema)

export {refreshTokendb}
 