import {Request, Response, NextFunction} from 'express';
import { CustomRequest } from './authentication-middleware';

const adminAuthorizationMiddleware = (req:CustomRequest,res:Response,next:NextFunction)=>{
    const  {role} = req.userInfo
    if (role !== "admin"){
         return res.status(403).json({
            success:false,
            message:"access denied ,only admin has permission"
        })
    }
    next()  
}           
 
export {adminAuthorizationMiddleware} 