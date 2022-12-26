// Copyright 2017-2022 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Member from './Member';
import Summary from './Summary';

interface Props {
  className?: string;
  members?: MemberType[];
}

function Members ({ className, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef([
    [t('members'), 'start'],
    [t('rank'), 'number']
  ]);

  return (
    <div className={className}>
      <Summary members={members} />
      <Table
        className={className}
        empty={members && t<string>('No members found')}
        header={headerRef.current}
      >
        {members && members.map((a): React.ReactNode => (
          <Member
            key={a.accountId}
            value={a}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Members);
