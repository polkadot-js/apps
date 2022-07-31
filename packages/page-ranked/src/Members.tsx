// Copyright 2017-2022 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import Member from './Member';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  members?: string[];
}

function Members ({ className, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef([
    [t('members'), 'start']
  ]);

  return (
    <Table
      className={className}
      empty={members && t<string>('No members found')}
      header={headerRef.current}
    >
      {members && members.map((a): React.ReactNode => (
        <Member
          address={a}
          key={a}
        />
      ))}
    </Table>
  );
}

export default React.memo(Members);
