// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyMember } from '@polkadot/api-derive/types';
import { OwnMembers } from './types';

import { useEffect, useState } from 'react';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

function transform (allAccounts: string[], members: DeriveSocietyMember[]): OwnMembers {
  const allMembers = members
    .filter((member): boolean => !member.isSuspended)
    .map((member): string => member.accountId.toString());
  const ownMembers = allMembers
    .filter((address): boolean => allAccounts.includes(address));

  return { allMembers, isMember: ownMembers.length !== 0, ownMembers };
}

export default function useMembers (): OwnMembers {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [state, setState] = useState<OwnMembers>({ allMembers: [], isMember: false, ownMembers: [] });
  const members = useCall<DeriveSocietyMember[]>(api.derive.society?.members, []);

  useEffect((): void => {
    allAccounts && members && setState(
      transform(allAccounts, members)
    );
  }, [allAccounts, members]);

  return state;
}
