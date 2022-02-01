// Copyright 2017-2022 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bid } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useCounterImpl (): number {
  const { api } = useApi();
  const bids = useCall<Bid[]>(api.query.society?.candidates);

  return bids?.length || 0;
}

export default createNamedHook('useCounter', useCounterImpl);
