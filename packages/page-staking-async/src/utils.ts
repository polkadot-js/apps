// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';

export const getApi = async (url: string[]|string) => {
  const api = await ApiPromise.create({
    provider: new WsProvider(url)
  });

  await api.isReadyOrError;

  return api;
};
