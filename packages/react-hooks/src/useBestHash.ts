// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Header } from '@polkadot/types/interfaces';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';
import { useCall } from './useCall';

const OPT = {
  transform: (header: Header) => header.hash.toHex()
};

function useBestHashImpl (): string | undefined {
  const { api } = useApi();

  return useCall<string>(api.rpc.chain.subscribeNewHeads, undefined, OPT);
}

export const useBestHash = createNamedHook('useBestHash', useBestHashImpl);
