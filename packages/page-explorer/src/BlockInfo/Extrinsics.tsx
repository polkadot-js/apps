// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';
import { KeyedEvent } from '@polkadot/react-query/types';

import React, { useMemo } from 'react';
import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import ExtrinsicDisplay from './Extrinsic';

interface Props {
  blockNumber?: BlockNumber;
  className?: string;
  events?: KeyedEvent[];
  label?: React.ReactNode;
  value?: Extrinsic[] | null;
}

function Extrinsics ({ blockNumber, className = '', events, label, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo(() => [
    [label || t<string>('extrinsics'), 'start', 2],
    [t('events'), 'start', 2],
    [t('signer'), 'address']
  ], [label, t]);

  return (
    <Table
      className={className}
      empty={t<string>('No pending extrinsics are in the queue')}
      header={header}
      isFixed
    >
      {value?.map((extrinsic, index): React.ReactNode =>
        <ExtrinsicDisplay
          blockNumber={blockNumber}
          events={events}
          index={index}
          key={`extrinsic:${index}`}
          value={extrinsic}
        />
      )}
    </Table>
  );
}

export default React.memo(Extrinsics);
