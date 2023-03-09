// Copyright 2017-2023 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Snippet } from './../types.js';

import { constsStakingParameters } from './consts-examples.js';
import { extrinsicMakeTransfer } from './extrinsics-examples.js';
import { rpcNetworkAuthoring, rpcNewHead, rpcQueryState, rpcSysthemInfo } from './rpc-examples.js';
import { storageGetInfo, storageKeys, storageListenToBalanceChange, storageListenToMultipleBalancesChange, storageRetrieveInfoOnQueryKeys, storageSystemEvents } from './storage-examples.js';

const snippets: Snippet[] = [
  rpcNetworkAuthoring,
  rpcNewHead,
  rpcQueryState,
  rpcSysthemInfo,
  storageGetInfo,
  storageSystemEvents,
  storageListenToBalanceChange,
  storageListenToMultipleBalancesChange,
  storageRetrieveInfoOnQueryKeys,
  storageKeys,
  constsStakingParameters,
  extrinsicMakeTransfer
];

export default snippets;
