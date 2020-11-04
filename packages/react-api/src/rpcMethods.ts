
import {DefinitionRpc} from '@polkadot/types/types'
export default function getRPCMethods ():Record<string, Record<string, DefinitionRpc>> {
    let dummyDescription={
      description: 'Just a test method',
      params: [
        {
          name: 'index',
          type: 'u64'
        },
        {
          name: 'at',
          type: 'Hash',
          isOptional: true
        }
      ],
      type: 'Balance'
    }
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
      unsubscribe: dummyDescription, 
      net_listening: dummyDescription, 
      net_peerCount: dummyDescription, 
      net_version: dummyDescription
    }}}
  