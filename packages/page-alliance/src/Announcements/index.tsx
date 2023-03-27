// Copyright 2017-2023 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Cid } from '../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Accouncement from './Accouncement.js';

interface Props {
  accouncements?: Cid[];
  className?: string;
}

function Announcements ({ accouncements, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const annRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t<string>('annoucements'), 'start'],
    [t<string>('version'), 'number'],
    [t<string>('codec'), 'number'],
    [t<string>('code'), 'number']
  ]);

  return (
    <div className={className}>
      <Table
        empty={accouncements && t<string>('No annoucements')}
        header={annRef.current}
      >
        {accouncements && accouncements.map((a) => (
          <Accouncement
            key={a.key}
            value={a}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Announcements);
