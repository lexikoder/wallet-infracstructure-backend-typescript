import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
     type:String,
     required:[true,"username required"],
     unique:true,
     trim: true,
     maxLength: [30,"cannot exceed 100 characters"]
    },
    email:{
     type:String,
     required:[true,"email  required"],
     unique:true,
     trim: true,
     lowercase:true
    },
    password:{
     type:String,
     required:[true,"Password required"],
    },
    role:{
        type:String,
        enum:["user","admin"],
        default: "user"
    }
},{timestamps:true})
 
const User =mongoose.model("User",userSchema)

export {User}
 