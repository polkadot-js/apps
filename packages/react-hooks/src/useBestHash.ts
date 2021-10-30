// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Header } from '@polkadot/types/interfaces';

import { useApi } from './useApi';
import { useCall } from './useCall';
import { createNamedHook } from './useNamedHook';

const optCall = {
  transform: (header: Header) => header.hash.toHex()
};

function useBestHashImpl (): string | undefined {
  const { api } = useApi();

  return useCall<string>(api.rpc.chain.subscribeNewHeads, undefined, optCall);
}

export const useBestHash = createNamedHook('useBestHash', useBestHashImpl);
