// Copyright 2017-2025 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType } from '../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Member from './Member.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  members?: MemberType[];
}

function Members ({ className, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('members'), 'start']
  ]);

  return (
    <div className={className}>
      <Summary members={members} />
      <Table
        className={className}
        empty={members && t('No members found')}
        header={headerRef.current}
        isSplit
      >
        {members?.map((a): React.ReactNode => (
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
