import  mongoose from "mongoose"

interface ApiType {
  apitype: string;
  count: number;
  expiresat?: number;
}

// subscriptionCount subdocument
interface SubscriptionCount {
  subscription: 'free' | 'premium';
  apicount: ApiType[];
}

// encryptedKey subdocument
interface EncryptedKey {
  iv: string;
  encryptedkey: string;
  hashedkey: string;
}

// Main document interface
export interface SubscriptionApikeyDocument extends Document {
  user: mongoose.Types.ObjectId;
  apikey: EncryptedKey;
  subscription: SubscriptionCount;
  createdAt: Date;
  updatedAt: Date;
}
const apiTypeSchema = new mongoose.Schema<ApiType>({
    apitype:{
     type:String,
   
    },
    count:{
     type:Number,
     default:0
    },
    expiresat: {
    type: Number,
    // default: () => {
    //     // putting this in a function allows this to not run when the schema is defined it should only run when document is created
    //     return Date.now() + 30 * 24 * 60 * 60 * 1000} // 30 days from now
  }
},{ _id: false })

const subscriptionCountSchema = new mongoose.Schema<SubscriptionCount>({
    subscription:{
     type:String,
     enum:["free","premium"],
     default:"free"
    },
    apicount:[apiTypeSchema]  
},{ _id: false })

const encryptedkeySchema = new mongoose.Schema<EncryptedKey>({
    iv:{
     type:String,
   
    },
    encryptedkey:{
     type:String,
    },
    hashedkey:{
     type:String
    }
},{ _id: false })

const subscriptionApikeySchema = new mongoose.Schema<SubscriptionApikeyDocument>({
    user:{
         type: mongoose.Schema.Types.ObjectId, ref: "User",
         required:[true,"userId is  required"],
         unique:true
        },
    apikey:encryptedkeySchema,
    subscription:subscriptionCountSchema
},{timestamps:true})
 
const SubscriptionApikey =mongoose.model<SubscriptionApikeyDocument>("SubscriptionApikey",subscriptionApikeySchema)

export {SubscriptionApikey} 
 
     