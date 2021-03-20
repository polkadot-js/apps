// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bid } from '@polkadot/types/interfaces';

import { useApi, useCall } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { api } = useApi();
  const bids = useCall<Bid[]>(api.query.society?.candidates);

  return bids?.length || 0;
}
