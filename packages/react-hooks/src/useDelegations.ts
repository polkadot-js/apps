// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { Voting } from '@polkadot/types/interfaces';

export function useDelegations (): Voting[] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  return useCall<Voting[]>(api.query.democracy?.votingOf?.multi, [allAccounts]);
}
