// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi, useCall } from '@polkadot/react-hooks';

export default function useCounter (): number {
  const { api } = useApi();
  const queued = useCall<unknown[]>(api.derive.democracy.dispatchQueue);

  return queued?.length || 0;
}
