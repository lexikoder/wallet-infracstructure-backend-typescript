"use strict";
// import axios from 'axios';
// import crypto from 'crypto';
// import { WEBHOOKS } from './config';
// export async function dispatchWebhook(payload: any) {
//   for (const webhook of WEBHOOKS) {
//     const signature = crypto
//       .createHmac('sha256', webhook.secret)
//       .update(JSON.stringify(payload))
//       .digest('hex');
//     try {
//       await axios.post(webhook.url, payload, {
//         headers: { 'x-signature': signature, 'Content-Type': 'application/json' },
//         timeout: 5000,
//       });
//       console.log('Webhook sent to', webhook.url);
//     } catch (err: any) {
//       console.error('Webhook failed for', webhook.url, err.message);
//       // Optionally push back to queue for retry
//     }
//   }
// }
