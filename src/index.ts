require("dotenv").config();
import express ,{Express} from "express"

// const bookRoutes = require("./routes/book-routes") 
import {router as authRoutes} from "./routes/auth-routes"
import  {router as walletRoutes} from "./routes/wallet-routes"
import  {router as apikeyRoutes} from "./routes/apikey-routes"
import  {connectToDB} from "./database/db"

import  {configureCors} from "./middleware/corsConfig"
import  {ratelimitingGeneral}  from "./middleware/rateLimiting"
import  {errorHandler} from "./middleware/errorHandler"
import  helmet from "helmet"
import cookieParser from 'cookie-parser'
import timeout from "connect-timeout";

const port = process.env.PORT ;
const app: Express = express();

app.use(helmet());
// app.use(timeout("60s"));
app.use(configureCors()) 
app.use(ratelimitingGeneral(100,15*60*1000))
app.use(express.json())
app.use(cookieParser());
 
   
  
app.use("/api/auth", authRoutes); 
app.use("/api/wallet", walletRoutes); 
app.use("/api/apikey", apikeyRoutes);    


app.use(errorHandler)

async function runServer() {
  try {
    await connectToDB();

    app.listen(port, () => {
    
      console.log(`Server running on port ${port}`);
    });
    
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
runServer();



