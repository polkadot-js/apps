// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyMember } from '@polkadot/api-derive/types';
import { OwnMembers } from './types';

import { useEffect, useState } from 'react';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

export default function useMembers (): OwnMembers {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const members = useCall<DeriveSocietyMember[]>(api.derive.society?.members, []);
  const [ownState, setOwnState] = useState<OwnMembers>({ allMembers: [], isMember: false, ownMembers: [] });

  useEffect((): void => {
    if (allAccounts && members) {
      const allMembers = members
        .filter((member): boolean => !member.isSuspended)
        .map((member): string => member.accountId.toString());
      const ownMembers = allMembers
        .filter((address): boolean => allAccounts.includes(address));

      setOwnState({ allMembers, isMember: ownMembers.length !== 0, ownMembers });
    }
  }, [allAccounts, members]);

  return ownState;
}
