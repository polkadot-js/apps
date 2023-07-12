// Copyright 2017-2023 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useCounterImpl (): number {
  const { api } = useApi();
  const bids = useCall(api.query.society?.candidates);

  return bids?.length || 0;
}

export default createNamedHook('useCounter', useCounterImpl);
