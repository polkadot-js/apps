// Copyright 2017-2020 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Snippet } from './../types';

import { constsStakingParameters } from './consts-examples';
import { extrinsicMakeTransfer } from './extrinsics-examples';
import { rpcNetworkAuthoring, rpcNewHead, rpcQueryState, rpcSysthemInfo } from './rpc-examples';
import { storageGetInfo, storageSystemEvents, storageKeys, storageListenToBalanceChange, storageListenToMultipleBalancesChange, storageRetrieveInfoOnQueryKeys } from './storage-examples';

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
