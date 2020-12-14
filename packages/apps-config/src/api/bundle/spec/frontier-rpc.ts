// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DefinitionRpc, DefinitionRpcParam } from '@polkadot/types/types';

export default function createFrontier (): Record<string, Record<string, DefinitionRpc>> {
  function generateDescription (description:string, returnType:string, params:DefinitionRpcParam[] = []): DefinitionRpc {
    return {
      description,
      params,
      type: returnType
    };
  }

  const numberParam: DefinitionRpcParam = { isOptional: true, name: 'number', type: 'BlockNumber' };
  const hashParam: DefinitionRpcParam = { name: 'hash', type: 'H256' };
  const reqParam: DefinitionRpcParam = { name: 'request', type: 'CallRequest' };
  const blockParam: DefinitionRpcParam = { name: 'block', type: 'BlockNumber' };
  const addressParam: DefinitionRpcParam = { name: 'address', type: 'H160' };
  const indexParam: DefinitionRpcParam = { name: 'index', type: 'U256' };

  return {
    eth: {
      accounts: generateDescription('Returns accounts list.', 'Vec<H160>'),
      blockNumber: generateDescription('Returns balance of the given account.', 'U256'),
      call: generateDescription('Call contract, returning the output data.', 'Bytes', [reqParam, numberParam]),
      chainId: generateDescription(
        'Returns the chain ID used for transaction signing at the current best block. None is returned if not available.',
        'U64'
      ),
      coinbase: generateDescription('Returns block author.', 'H160'),
      estimateGas: generateDescription('Estimate gas needed for execution of given contract.', 'U256', [
        reqParam,
        numberParam
      ]),
      gasPrice: generateDescription('Returns current gas_price.', 'U256'),
      getBalance: generateDescription('Returns balance of the given account.', 'U256', [addressParam, numberParam]),
      getBlockByHash: generateDescription('Returns block with given hash.', 'RichBlock', [
        hashParam,
        { isOptional: true, name: 'full', type: 'bool' }
      ]),
      getBlockByNumber: generateDescription('Returns block with given number.', 'RichBlock', [
        blockParam,
        { isOptional: true, name: 'full', type: 'bool' }
      ]),
      getBlockTransactionCountByHash: generateDescription(
        'Returns the number of transactions in a block with given hash.',
        'U256',
        [hashParam]
      ),
      getBlockTransactionCountByNumber: generateDescription(
        'Returns the number of transactions in a block with given block number.',
        'U256',
        [blockParam]
      ),
      getCode: generateDescription('Returns the code at given address at given time (block number).', 'Bytes', [
        addressParam,
        numberParam
      ]),
      getLogs: generateDescription('Returns logs matching given filter object.', 'Vec<Log>', [
        { name: 'filter', type: 'Filter' }
      ]),
      getStorageAt: generateDescription('Returns content of the storage at given address.', 'H256', [
        addressParam,
        indexParam,
        numberParam
      ]),
      getTransactionByBlockHashAndIndex: generateDescription(
        'Returns transaction at given block hash and index.',
        'Transaction',
        [hashParam, indexParam]
      ),
      getTransactionByBlockNumberAndIndex: generateDescription(
        'Returns transaction by given block number and index.',
        'Transaction',
        [numberParam, indexParam]
      ),
      getTransactionByHash: generateDescription('Get transaction by its hash.', 'Transaction', [hashParam]),
      getTransactionCount: generateDescription(
        'Returns the number of transactions sent from given address at given time (block number).',
        'U256',
        [hashParam, numberParam]
      ),
      getTransactionReceipt: generateDescription('Returns transaction receipt by transaction hash.', 'Receipt', [
        hashParam
      ]),
      getUncleByBlockHashAndIndex: generateDescription('Returns an uncles at given block and index.', 'RichBlock', [
        hashParam,
        indexParam
      ]),
      getUncleByBlockNumberAndIndex: generateDescription('Returns an uncles at given block and index.', 'RichBlock', [
        numberParam,
        indexParam
      ]),
      getUncleCountByBlockHash: generateDescription(
        'Returns the number of uncles in a block with given hash.',
        'U256',
        [hashParam]
      ),
      getUncleCountByBlockNumber: generateDescription(
        'Returns the number of uncles in a block with given block number.',
        'U256',
        [numberParam]
      ),
      getWork: generateDescription(
        'Returns the hash of the current block, the seedHash, and the boundary condition to be met.',
        'Work'
      ),
      hashrate: generateDescription('Returns the number of hashes per second that the node is mining with.', 'U256'),
      mining: generateDescription('Returns true if client is actively mining new blocks.', 'bool'),
      protocolVersion: generateDescription(
        'Returns protocol version encoded as a string (quotes are necessary).',
        'u64'
      ),
      sendRawTransaction: generateDescription('Sends signed transaction, returning its hash.', 'BoxFuture<H256>', [
        { name: 'bytes', type: 'Bytes' }
      ]),
      submitHashrate: generateDescription('Used for submitting mining hashrate.', 'bool', [indexParam, hashParam]),
      submitWork: generateDescription('Used for submitting a proof-of-work solution.', 'bool', [
        { name: '_', type: 'H64' },
        { name: '_', type: 'H256' },
        { name: '_', type: 'H256' }
      ]),
      subscribe: generateDescription('Subscribe to Eth subscription.', '', [
        { name: '_metadata', type: 'Self::Metadata' },
        { name: 'subscriber', type: 'Subscriber<PubSubResult>' },
        { name: 'kind', type: 'Kind' },
        { isOptional: true, name: 'params', type: 'Params' }
      ]),
      syncing: generateDescription('Returns an object with data about the sync status or false. (wtf?)', 'SyncStatus'),
      unsubscribe: generateDescription('nsubscribe from existing Eth subscription.', '', [
        { name: '_metadata', type: 'Self::Metadata' },
        { name: 'subscription_id', type: 'Self::SubscriptionId' }
      ])
    },
    net: {
      listening: generateDescription(
        'Returns true if client is actively listening for network connections. Otherwise false.',
        'bool'
      ),
      peerCount: generateDescription('Returns number of peers connected to node.', 'String'),
      version: generateDescription('Returns protocol version.', 'String')
    }
  };
}
