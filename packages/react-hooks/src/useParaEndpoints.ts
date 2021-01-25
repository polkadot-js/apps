// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { LinkOption } from '@polkadot/apps-config/settings/types';

import { useMemo } from 'react';

import { createWsEndpoints } from '@polkadot/apps-config';
import { bnToBn } from '@polkadot/util';

import { useApi } from './useApi';

function extractResults (genesisHash: string, paraId: BN | number): LinkOption[] {
  const numId = bnToBn(paraId).toNumber();

  return createWsEndpoints((key: string, value: string | undefined) => value || key).filter(({ genesisHashRelay, paraId }) =>
    paraId === numId && genesisHashRelay === genesisHash
  );
}

export function useParaEndpoints (paraId: BN | number): LinkOption[] {
  const { api } = useApi();

  return useMemo(
    () => extractResults(api.genesisHash.toHex(), paraId),
    [api, paraId]
  );
}
