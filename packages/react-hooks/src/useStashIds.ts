// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import useApi from './useApi';
import useCall from './useCall';

export default function useStashIds (): string[] | undefined {
  const { api } = useApi();
  const allStashes = useCall<string[]>(api.derive.staking.stashes, [], {
    transform: (stashes: AccountId[]) => stashes.map((accountId) => accountId.toString())
  });

  return allStashes;
}
