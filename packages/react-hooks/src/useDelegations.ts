// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletDemocracyVoteVoting } from '@polkadot/types/lookup';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

import { createNamedHook } from './createNamedHook.js';

function useDelegationsImpl () {
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  return useCall(api.query.democracy?.votingOf?.multi, [allAccounts]);
}

export const useDelegations = createNamedHook('useDelegations', useDelegationsImpl);
