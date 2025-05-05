// Copyright 2017-2025 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MapMember } from '../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useBestNumber } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Member from './Member.js';

interface Props {
  className?: string;
  mapMembers?: MapMember[];
}

function Members ({ className = '', mapMembers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const bestNumber = useBestNumber();

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t('members'), 'start', 2],
    [t('voted on'), 'start'],
    [t('strikes')],
    []
  ]);

  return (
    <Table
      className={className}
      empty={mapMembers && t('No active members')}
      header={headerRef.current}
    >
      {mapMembers?.map((value): React.ReactNode => (
        <Member
          bestNumber={bestNumber}
          key={value.key}
          value={value}
        />
      ))}
    </Table>
  );
}

export default React.memo(Members);
