/**
 * @polkadot/jsonrpc has been deprecated since version 1.8.1
 *
 * TODO: Get refactored by using types to make PRC decoration, once polkadot/api dependency is upgraded to 1.8.1 above
 */

// import { RpcMethodOpt } from '@polkadot/jsonrpc/types';
// import createMethod from '@polkadot/jsonrpc/create/method';
// import createParam from '@polkadot/jsonrpc/create/param';

// const buyPrice: RpcMethodOpt = {
//   description: 'Retrieves the spot exchange buy price',
//   params: [
//     createParam('AssetToBuy', 'AssetId'),
//     createParam('Amount', 'Balance'),
//     createParam('AssetToPay', 'AssetId')
//   ],
//   type: 'Balance'
// };

// const sellPrice: RpcMethodOpt = {
//   description: 'Retrieves the spot exchange sell price',
//   params: [
//     createParam('AssetToSell', 'AssetId'),
//     createParam('Amount', 'Balance'),
//     createParam('AssetToPayout', 'AssetId')
//   ],
//   type: 'Balance'
// };

// const cennzx = {
//   isDeprecated: false,
//   isHidden: false,
//   description: 'CENNZX',
//   section: 'cennzx',
//   methods: [
//     { buyPrice: createMethod('cennzx', 'buyPrice', buyPrice) },
//     { sellPrice: createMethod('cennzx', 'sellPrice', sellPrice) }
//   ]
// };

// const cennzx = [
//   { buyPrice: createMethod('cennzx', 'buyPrice', buyPrice) },
//   { sellPrice: createMethod('cennzx', 'sellPrice', sellPrice) }
// ];

const cennzx = [
  {
    name: 'buyPrice',
    description: 'Just a test method',
    params: [
      { name: 'AssetToBuy', type: 'AssetId' },
      { name: 'Amount', type: 'Balance' },
      { name: 'AssetToPay', type: 'AssetId' }
    ],
    type: 'Balance'
  },
  {
    name: 'sellPrice',
    description: 'Just a test method',
    params: [
      { name: 'AssetToSell', type: 'AssetId' },
      { name: 'Amount', type: 'Balance' },
      { name: 'AssetToPayout', type: 'AssetId' }
    ],
    type: 'Balance'
  }
];

export default {
  cennzx
};
