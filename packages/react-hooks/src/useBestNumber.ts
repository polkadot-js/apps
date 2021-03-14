// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';

import { useApi } from './useApi';
import { useCall } from './useCall';

export function useBestNumber (): BlockNumber | undefined {
  const { api } = useApi();

  return useCall<BlockNumber>(api.derive.chain.bestNumber);
}
