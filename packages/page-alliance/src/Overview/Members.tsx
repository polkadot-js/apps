// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { Member as MemberType } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Member from './Member';

interface Props {
  className?: string;
  members?: MemberType[];
  prime?: AccountId | null;
  voters?: string[];
}

function Members ({ className, members, prime, voters }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const hdrRef = useRef([
    [t<string>('members'), 'start', 3],
    [t<string>('deposit'), 'number'],
    [t<string>('role'), 'number'],
    []
  ]);

  return (
    <div className={className}>
      <Table
        empty={members && t<string>('No members')}
        header={hdrRef.current}
      >
        {members && members.map((m) => (
          <Member
            info={m}
            isPrime={!!prime && prime.eq(m.accountId)}
            isVoter={!!voters && voters.includes(m.accountId)}
            key={m.accountId}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Members);
