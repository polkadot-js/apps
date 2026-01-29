// Copyright 2017-2025 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { QueueTotal } from './types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Queue from './Queue.js';

interface Props {
  className?: string;
  queueTotals?: QueueTotal[];
}

function Queues ({ className, queueTotals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('queues'), 'start'],
    [t('participants'), 'number'],
    [t('balance'), 'number']
  ]);

  return (
    <Table
      className={className}
      empty={queueTotals && t('No active gilt queues found.')}
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
