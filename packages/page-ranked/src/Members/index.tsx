// Copyright 2017-2023 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType } from '../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Member from './Member';
import Summary from './Summary';

interface Props {
  className?: string;
  members?: MemberType[];
}

function Members ({ className, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t<string>('members'), 'start']
  ]);

  return (
    <div className={className}>
      <Summary members={members} />
      <Table
        className={className}
        empty={members && t<string>('No members found')}
        header={headerRef.current}
        isSplit
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
