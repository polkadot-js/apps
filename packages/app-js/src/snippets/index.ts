// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
