// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { u32 } from '@polkadot/types-codec';

import getCommitteeManagement from '@polkadot/react-api/getCommitteeManagement';

export const getBlocksImportantForSession = (session: number, api: ApiPromise) => {
  const blocksInSession = (getCommitteeManagement(api).consts.sessionPeriod as u32).toNumber();

  // AlephBFT and Aura sessions are off by one block, hence the difference.
  return {
    firstBlockOfSelectedAuraSession: session * blocksInSession + 1,
    lastBlockOfPrecedingAlephBFTSession: session * blocksInSession - 1
  };
};

export const getApiAtBlock = async (block: number, api: ApiPromise): ReturnType<ApiPromise['at']> => {
  const blockHash = await api.rpc.chain.getBlockHash(block);

  return api.at(blockHash);
};
