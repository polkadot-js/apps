// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, BalanceOf } from '@polkadot/types/interfaces';

import { useApi } from './useApi';
import { useCall } from './useCall';

export function useSubidentities (address: string): AccountId[] | undefined {
  const { api } = useApi();

  return useCall<[BalanceOf, AccountId[]]>(api.query.identity?.subsOf, [address])?.[1];
}
