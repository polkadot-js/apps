// Copyright 2017-2020 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DefinitionRpc } from '@polkadot/types/types';

export default function ():Record<string, Record<string, DefinitionRpc>> {
  const dummyDescription = {
    description: 'Just a test method',
    params: [
      {
        name: 'index',
        type: 'u64'
      },
      {
        isOptional: true,
        name: 'at',
        type: 'Hash'
      }
    ],
    type: 'Balance'
  };

  return {
    eth: {
      accounts: dummyDescription,
      blockNumber: dummyDescription,
      call: dummyDescription,
      chainId: dummyDescription,
      coinbase: dummyDescription,
      estimateGas: dummyDescription,
      gasPrice: dummyDescription,
      getBalance: dummyDescription,
      getBlockByHash: dummyDescription,
      getBlockByNumber: dummyDescription,
      getBlockTransactionCountByHash: dummyDescription,
      getBlockTransactionCountByNumber: dummyDescription,
      getCode: dummyDescription,
      getLogs: dummyDescription,
      getStorageAt: dummyDescription,
      getTransactionByBlockHashAndIndex: dummyDescription,
      getTransactionByBlockNumberAndIndex: dummyDescription,
      getTransactionByHash: dummyDescription,
      getTransactionCount: dummyDescription,
      getTransactionReceipt: dummyDescription,
      getUncleByBlockHashAndIndex: dummyDescription,
      getUncleByBlockNumberAndIndex: dummyDescription,
      getUncleCountByBlockHash: dummyDescription,
      getUncleCountByBlockNumber: dummyDescription,
      getWork: dummyDescription,
      hashrate: dummyDescription,
      mining: dummyDescription,
      protocolVersion: dummyDescription,
      sendRawTransaction: dummyDescription,
      submitHashrate: dummyDescription,
      submitWork: dummyDescription,
      subscribe: dummyDescription,
      syncing: dummyDescription,
      unsubscribe: dummyDescription
    },
    net: {
      listening: dummyDescription,
      peerCount: dummyDescription,
      version: dummyDescription
    }
  };
}
