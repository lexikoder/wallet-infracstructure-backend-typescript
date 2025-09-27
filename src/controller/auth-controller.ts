import  {User} from "../models/user"
import {SubscriptionApikey} from "../models/subscription-apikeys"
import  {refreshTokendb} from "../models/refreshToken"
import  { nodemailerOtp } from "../utils/sendEmail"
import  {generateOTP} from "../utils/generateOtp"
import  {tryCatch} from "../utils/tryCatch"
import  bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import  {AppError} from "../utils/appError"

import  { v4 as uuidv4 } from "uuid"
import  { encrypt, decrypt } from "../utils/encrypt"
import crypto from "crypto"
import {Request, Response, NextFunction} from 'express';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET_KEY){
  throw new Error("JWT_SECRET_KEY is missing")
}

const acesstokenpiration = 1; //in minutes
const refreshtokenpiration = 1; //in days

type OtpEntry = {
  otp: string;
  expiresAt: number;
  verified: boolean;
};

const otpCache: Record<string, OtpEntry> = {};

const reqOtp = tryCatch(async (req:Request<{},{},{email:string}>, res:Response) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError("missing required field", 400);
  }
  const otp = generateOTP();
  //     // this is stored like this{"myeamail@gmail.com":{
  //   otp: otp,
  //   expiresAt: Date.now() + expirytimeinminutes * 60 * 1000, // 10 minutes
  //   verified: false
  // }}
  const expirytimeinminutes = 10;
  otpCache[email] = {
    otp: otp,
    expiresAt: Date.now() + expirytimeinminutes * 60 * 1000, // 10 minutes
    verified: false,
  };

  await nodemailerOtp(email, otp, expirytimeinminutes);
 console.log(otp)
  res.status(200).json({
    success: true,
    message: "otp sent successfully",
  });
});

const verifyOtp = tryCatch(async (req:Request<{},{},{email:string,otp:string}>, res:Response) => {
  const { email, otp } = req.body;

  if (!otpCache.hasOwnProperty(email)) {
    throw new AppError("otp not yet requested", 400);
  }

  if (Date.now() > otpCache[email].expiresAt) {
    delete otpCache[email];
    throw new AppError("OTP expired", 400);
  }

  if (otpCache[email].verified === true) {
    throw new AppError("OTP verified", 400);
  }

  if (otpCache[email].otp === otp.trim()) {
    // delete otpCache[email] should occur when you register
    otpCache[email].verified = true;
    return res.status(200).json({
      success: true,
      message: "otp verified successfuly",
    });
  } else {
    throw new AppError("Invalid Otp", 400);
  }
});

// Register endpoint
const RegisterUser = tryCatch(async (req:Request<{},{},{password:string,username:string,email:string}>, res:Response) => {
  const userData = req.body;
  if (!userData.password || !userData.username || !userData.email) {
    throw new AppError("missing required field", 400);
  }

  const checkUserNameExist = await User.findOne({
    username: userData?.username,
  });
  const checkEmailExist = await User.findOne({ email: userData?.email });

  if (checkUserNameExist || checkEmailExist) {
    throw new AppError("email or password already exist", 404);
  }

  if (!otpCache[userData.email] || !otpCache[userData.email]?.verified) {
    throw new AppError("Email not verified with OTP", 400);
  }
  delete otpCache[userData.email];
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData?.password, salt);
  let apikey = uuidv4();
  const encryptedData = encrypt(apikey);

  const hashedapikey = crypto.createHash("sha256").update(apikey).digest("hex");
  const encryptapikey = {
    iv: encryptedData.iv,
    encryptedkey: encryptedData.encryptedkey,
    hashedkey: hashedapikey,
  };

  let NewUserData = { ...userData, password: hashedPassword };

  const newlycreatedUser = await User.create(NewUserData);

  const createnewuser = await SubscriptionApikey.create({
    user: newlycreatedUser._id,
    apikey: encryptapikey,
  });

  if (newlycreatedUser && createnewuser) {
    return res.status(201).json({
      success: true,
      message: "created successfully",
    });
  }
});

export interface UserInfo {
    
      userId: any
      username: string
      role: string
    
}
// Login end point
const LoginUser = tryCatch(async (req:Request<{},{},{username:string,password:string}>, res:Response) => {
  const { username, password } = req.body;
  const checkUserNameExist = await User.findOne({ username: username });
  if (!checkUserNameExist) {
    throw new AppError("Invalid credentials", 400);
  }
  const isPasswordMatch = await bcrypt.compare(
    password,
    checkUserNameExist?.password
  );
  if (!isPasswordMatch) {
    throw new AppError("Invalid credentials", 400);
  }
  const userInfo:UserInfo = {
      userId: checkUserNameExist._id,
      username: checkUserNameExist.username,
      role: checkUserNameExist.role,
    }
  const accessToken = jwt.sign(userInfo
    ,
    JWT_SECRET_KEY,
    {
      expiresIn: `${acesstokenpiration}m`,
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: checkUserNameExist._id,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: `${refreshtokenpiration}d`,
    }
  );

  await refreshTokendb.create({
    token: refreshToken,
    user: checkUserNameExist._id,
    //expires in 1 day
    // 1 * 24 * 60 * 60 * 1000
    expiresAt: new Date(Date.now() + 3 * 60 * 1000),
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: acesstokenpiration * 60 * 1000, // in  minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: refreshtokenpiration * 24 * 60 * 60 * 1000, // in  days
  });

  return res.status(201).json({
    success: true,
    message: "logged in successfully",
    // accessToken: accessToken,
    // refreshToken: refreshToken
  });
});

const refreshAccessToken = tryCatch(async (req:Request, res:Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("Refresh token not provided", 401);
  }

  const storedToken = await refreshTokendb.findOne({ token: refreshToken });
  if (!storedToken) {
    throw new AppError("Invalid refresh token", 403);
  }

  const { userId } = jwt.verify(refreshToken, JWT_SECRET_KEY) as { userId: string };

  // 3. Find user and generate new access token
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET_KEY,
    {
      expiresIn: `${acesstokenpiration}m`,
    }
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: acesstokenpiration * 60 * 1000, // in  minutes
  });

  return res.status(201).json({
    success: true,
    message: "Accesstoken generated",
    // accessToken: accessToken,
  });
});

const logout = tryCatch(async (req:Request, res:Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await refreshToken.deleteOne({ token: refreshToken });
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
});

const decryptApikey = tryCatch(async (req:Request, res:Response) => {
  const userId = req.params;
  const subapikey = await SubscriptionApikey.findById(userId);
  if (!subapikey) {
    throw new AppError("data not found", 404);
  }
  const apikey = decrypt(subapikey.apikey);

  return res
    .status(200)
    .json({
      success: true,
      message: "apikey decrypted",
      data: { apikey: apikey },
    });
});

export {
  reqOtp,
  verifyOtp,
  decryptApikey,
  RegisterUser,
  LoginUser,
  refreshAccessToken,
  logout,
};
