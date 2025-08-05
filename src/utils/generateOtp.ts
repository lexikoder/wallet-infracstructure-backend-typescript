import randomstring from "randomstring"

// otp should be stored using redis


function generateOTP(){
    return randomstring.generate({length:4,charset:"numeric"})
}

export {generateOTP} ;