// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import Member from './Member';
import Summary from './Summary';
import { useTranslation } from './translate';
import useMembers from './useMembers';

interface Props {
  className?: string;
}

function Collators ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const members = useMembers();

  const hdrRef = useRef([
    [t<string>('members'), 'start', 2],
    [t<string>('role'), 'number']
  ]);

  return (
    <div className={className}>
      <Summary />
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

export default React.memo(Collators);
