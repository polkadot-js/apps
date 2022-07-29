// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Member from './Member';

interface Props {
  className?: string;
  members?: MemberType[];
}

function Members ({ className, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const hdrRef = useRef([
    [t<string>('members'), 'start', 2],
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
            key={m.accountId}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Members);
