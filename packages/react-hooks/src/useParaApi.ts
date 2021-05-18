// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { LinkOption } from '@polkadot/apps-config/settings/types';

import { ApiPromise } from '@polkadot/api';

import { useEndpointApi } from './useEndpointApi';
import { useParaEndpoints } from './useParaEndpoints';

interface Result {
  api?: ApiPromise | null;
  endpoints: LinkOption[];
}

export function useParaApi (paraId: BN | number): Result {
  const endpoints = useParaEndpoints(paraId);

  return useEndpointApi(true, endpoints);
}
