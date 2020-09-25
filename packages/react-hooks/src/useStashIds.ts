// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId } from '@polkadot/types/interfaces';

import useApi from './useApi';
import useCall from './useCall';

const transformStashes = {
  transform: (stashes: AccountId[]) => stashes.map((accountId) => accountId.toString())
};

export default function useStashIds (): string[] | undefined {
  const { api } = useApi();

  return useCall<string[]>(api.derive.staking.stashes, undefined, transformStashes);
}
