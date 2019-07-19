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
  storageSystemEvents,
  storageListenToBalanceChange,
  storageListenToMultipleBalancesChange,
  storageRetrieveInfoOnQueryKeys
} from './storage-examples';

import {
  constsStakingParameters
} from './consts-examples';

import {
  extrinsicMakeTransfer
} from './extrinsics-examples';

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
  constsStakingParameters,
  extrinsicMakeTransfer
];

export default snippets;
