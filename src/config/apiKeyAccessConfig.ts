export const planLimits = {
    
  free: {
    "/api/wallet/createwallet":20,    //20 request per month
    "/api/wallet/createtransferdefault":20,
    "/api/wallet/getaddresses/:walletId":20 , 
    "/api/wallet/getdefaultaddress/:walletId":20,
    "/api/wallet/getbalance":20
  },
  premium: {
    "/api/wallet/createwallet":40,
    "/api/wallet/createtransferdefault":40,
    "/api/wallet/getaddresses/:walletId":40 , 
    "/api/wallet/getdefaultaddress/:walletId":40,
    "/api/wallet/getbalance":40
  },
};  

