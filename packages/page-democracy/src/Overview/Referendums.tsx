// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveReferendumExt } from '@polkadot/api-derive/types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Referendum from './Referendum.js';

interface Props {
  className?: string;
  referendums?: DeriveReferendumExt[];
}

function Referendums ({ className = '', referendums }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('referenda'), 'start', 2],
    [t('remaining'), 'media--1200'],
    [t('activate'), 'media--1400'],
    [t('turnout'), 'media--1400'],
    [undefined, 'badge'],
    [t('votes'), 'expand'],
    [undefined, 'media--1000'],
    [undefined, undefined, 2]
  ]);

  return (
    <Table
      className={className}
      empty={referendums && t('No active referendums')}
      header={headerRef.current}
    >
      {referendums?.map((referendum): React.ReactNode => (
        <Referendum
          key={referendum.index.toString()}
          value={referendum}
        />
      ))}
    </Table>
  );
}

export default React.memo(Referendums);
