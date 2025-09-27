import nodemailer from "nodemailer"
import {generateOtpEmail} from "../emailTemplates/otpTemplates"
import {resetLinkTemplate} from "../emailTemplates/resetLinkTemplates"

import dotenv from 'dotenv';
dotenv.config();
const EMAIL = process.env.EMAIL;
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;
if (!EMAIL ) {
    throw new Error('EMAIL and EMAIL_APP_PASSWORD is missing');
  }

const nodemailerResetLink = async (
  toemailaddress:any,
  username:any,
  resetLink:any,
  expires:any
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: EMAIL,
        pass: EMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: { name: "Admin", address: EMAIL },
      to: toemailaddress,
      subject: "Reset Password",
      html: resetLinkTemplate(username, resetLink, expires), // HTML body
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const nodemailerOtp = async (toemailaddress:any, otp:any, expires:any) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: EMAIL,
        pass: EMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: { name: "Admin", address: EMAIL },
      to: toemailaddress,
      subject: "OTP Verification",
      html: generateOtpEmail("user", otp, expires), // HTML body
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export  { nodemailerResetLink, nodemailerOtp };
