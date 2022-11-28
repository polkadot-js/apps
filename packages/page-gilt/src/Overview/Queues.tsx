// Copyright 2017-2022 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueTotal } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Queue from './Queue';

interface Props {
  className?: string;
  queueTotals?: QueueTotal[];
}

function Queues ({ className, queueTotals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('queues'), 'start'],
    [t('participants'), 'number'],
    [t('balance'), 'number']
  ]);

  return (
    <Table
      className={className}
      empty={queueTotals && t<string>('No active gilt queues found.')}
      header={headerRef.current}
    >
      {queueTotals?.map((value) => (
        <Queue
          key={value.index}
          value={value}
        />
      ))}
    </Table>
  );
}

export default React.memo(Queues);
