// Copyright 2017-2024 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { constsStakingParameters } from './consts-examples.js';
import { daSubmitDataCall, extrinsicMakeTransfer } from './extrinsics-examples.js';
import { rpcNetworkAuthoring, rpcNewHead, rpcQueryState, rpcSysthemInfo } from './rpc-examples.js';
import { storageGetInfo, storageKeys, storageListenToBalanceChange, storageListenToMultipleBalancesChange, storageRetrieveInfoOnQueryKeys, storageSystemEvents } from './storage-examples.js';

export { makeWrapper } from './wrapping.js';

export const allSnippets = [
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
  extrinsicMakeTransfer,
  daSubmitDataCall
] as const;
