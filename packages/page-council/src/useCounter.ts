// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

const transformCounter = {
  transform: (hashes: unknown[]) => hashes.length
};

export default function useCounter (): number {
  const { hasAccounts } = useAccounts();
  const { api, isApiReady } = useApi();
  const counter = useCall<number>(isApiReady && hasAccounts && api.query.council?.proposals, undefined, transformCounter) || 0;

  return counter;
}
