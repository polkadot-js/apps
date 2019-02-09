import { Snippet } from './../types';

import { 
  rpcNetworkAuthoring,
  rpcNewHead,
  rpcQueryState,
  rpcSysthemInfo
} from './rpc-examples';

import { 
  storageGetInfo,
  storageGetBalanceInformation,
  storageSystemEvents,
  storageListenToBalanceChange
} from './storage-examples';

import { extrinsicMakeTransfer } from './extrinsics-examples';

const snippets: Array<Snippet> = [
  rpcNetworkAuthoring,
  rpcNewHead,
  rpcQueryState,
  rpcSysthemInfo,
  storageGetInfo,
  storageGetBalanceInformation,
  storageSystemEvents,
  storageListenToBalanceChange,
  extrinsicMakeTransfer
];

export default snippets;
