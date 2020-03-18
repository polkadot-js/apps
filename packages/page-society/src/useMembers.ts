// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyMember } from '@polkadot/api-derive/types';
import { OwnMembers } from './types';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

function transform (allAccounts: string[]): (members: DeriveSocietyMember[]) => OwnMembers {
  return (members: DeriveSocietyMember[]): OwnMembers => {
    const allMembers = members
      .filter((member): boolean => !member.isSuspended)
      .map((member): string => member.accountId.toString());
    const ownMembers = allMembers
      .filter((address): boolean => allAccounts.includes(address));

    return { allMembers, isMember: ownMembers.length !== 0, ownMembers };
  };
}

export default function useMembers (): OwnMembers {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const state = useCall<OwnMembers>(api.derive.society?.members, [], {
    transform: transform(allAccounts)
  }) || { allMembers: [], isMember: false, ownMembers: [] };

  return state;
}
