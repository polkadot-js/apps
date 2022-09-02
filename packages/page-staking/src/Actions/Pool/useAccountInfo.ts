// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletNominationPoolsPoolMember } from '@polkadot/types/lookup';
import type { AccountInfo } from './types';

import { useEffect, useState } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

const OPT_DEL = {
  transform: (opt: Option<PalletNominationPoolsPoolMember>): PalletNominationPoolsPoolMember | null =>
    opt.unwrapOr(null)
};

function useAccountInfoImpl (accountId: string): AccountInfo | null {
  const { api } = useApi();
  const [state, setState] = useState<AccountInfo | null>(null);
  const member = useCall(api.query.nominationPools.poolMembers, [accountId], OPT_DEL);

  useEffect((): void => {
    member &&
      api.call
        .nominationPoolsApi
        .pendingRewards(accountId)
        .then((claimable) => setState({ claimable, member }))
        .catch(console.error);
  }, [accountId, member, api]);

  return state;
}

export default createNamedHook('useAccountInfo', useAccountInfoImpl);
