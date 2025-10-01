"use strict";
// import { createPublicClient,webSocket} from 'viem';
// import { mainnet } from 'viem/chains';
// import { parseAbiItem } from 'viem';
// import { USER_WALLETS, ERC20_CONTRACTS, INFURA_WS } from './config';
// import { saveDeposit } from './db';
// import { dispatchWebhook } from './webhookDispatcher';
// const client = createPublicClient({
//   chain: mainnet,
//   transport: webSocket(INFURA_WS),
// });
// // --- ETH deposits ---
// export function watchEthDeposits() {
//   client.watchBlocks({
//     onBlock: async (blockNumber) => {
//       const block = await client.getBlock({ blockNumber, includeTransactions: true });
//       for (const tx of block.transactions) {
//         if (USER_WALLETS.includes(tx.to)) {
//           const deposit = { wallet: tx.to!, amount: tx.value, txHash: tx.hash };
//           saveDeposit(deposit);
//           dispatchWebhook({ type: 'ETH', ...deposit });
//         }
//       }
//     },
//   });
// }
// // --- ERC20 deposits ---
// export function watchErc20Deposits() {
//   const transferEventAbi = parseAbiItem({
//     name: 'Transfer',
//     type: 'event',
//     inputs: [
//       { name: 'from', type: 'address', indexed: true },
//       { name: 'to', type: 'address', indexed: true },
//       { name: 'value', type: 'uint256', indexed: false },
//     ],
//   });
//   ERC20_CONTRACTS.forEach((contract) => {
//     client.watchContractEvent({
//       address: contract,
//       abi: [transferEventAbi],
//       eventName: 'Transfer',
//       onLogs: (logs) => {
//         for (const log of logs) {
//           if (USER_WALLETS.includes(log.args.to)) {
//             const deposit = {
//               wallet: log.args.to,
//               amount: log.args.value,
//               token: contract,
//               txHash: log.transactionHash,
//             };
//             saveDeposit(deposit);
//             dispatchWebhook({ type: 'ERC20', ...deposit });
//           }
//         }
//       },
//     });
//   });
// }
// // Start watchers
// export function startDepositWatcher() {
//   watchEthDeposits();
//   watchErc20Deposits();
//   console.log('Deposit watchers started.');
// }
