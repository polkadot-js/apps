// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { AccountId32 } from '@polkadot/types/interfaces/runtime';
import type { u32, Vec } from '@polkadot/types-codec';

import { useEffect, useState } from 'react';

import getCommitteeManagement from '@polkadot/react-api/getCommitteeManagement';

import { useApi } from './useApi.js';

export const useAlephBFTCommittee = (session: number): string[] | undefined => {
  const { api } = useApi();

  const [committee, setCommittee] = useState<string[]>();

  useEffect(() => {
    getAlephBFTCommittee(session, api)
      .then(setCommittee)
      .catch(console.error);
  }, [api, session]);

  return committee;
};

const getAlephBFTCommittee = async (session: number, api: ApiPromise) => {
  // Committee must be set on the last block of the preceding session.
  const blocksInSession = (getCommitteeManagement(api).consts.sessionPeriod as u32).toNumber();

  // AlephBFT and Aura sessions are off by one block, hence the difference.
  const lastBlockOfPrecedingAlephBFTSession = session * blocksInSession - 1;
  const firstBlockOfSelectedAuraSession = session * blocksInSession + 1;

  const pendingApiAtEndOfPrecedingAlephBFTSession = getApiAtBlock(lastBlockOfPrecedingAlephBFTSession, api);
  const pendingApiAtStartOfSelectedAuraSession = getApiAtBlock(firstBlockOfSelectedAuraSession, api);

  // AlephBFT committee in the past was the same as `session.validators`.
  // If `nextFinalityCommittee` isn't defined on a block, default to `session.validators`.
  const getFinalityCommittee: () => Promise<Vec<AccountId32>> = (
    (await pendingApiAtEndOfPrecedingAlephBFTSession).query.aleph.nextFinalityCommittee ||
    (await pendingApiAtStartOfSelectedAuraSession).query.session.validators
  );

  return (await getFinalityCommittee()).map((accountId) => accountId.toHuman());
};

const getApiAtBlock = async (block: number, api: ApiPromise): ReturnType<ApiPromise['at']> => {
  const blockHash = await api.rpc.chain.getBlockHash(block);

  return api.at(blockHash);
};
