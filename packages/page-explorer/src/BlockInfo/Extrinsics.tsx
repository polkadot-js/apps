// Copyright 2017-2021 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyedEvent } from '@polkadot/react-query/types';
import type { BlockNumber, Extrinsic } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

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
  const { api } = useApi();

  const header = useMemo(() => [
    [label || t<string>('extrinsics'), 'start', 2],
    [t('events'), 'start media--1000', 2],
    [t('weight'), 'media--1400'],
    [t('signer'), 'address media--1200']
  ], [label, t]);

  return (
    <Table
      className={className}
      empty={t<string>('No extrinsics available')}
      header={header}
      isFixed
    >
      {value?.map((extrinsic, index): React.ReactNode =>
        <ExtrinsicDisplay
          blockNumber={blockNumber}
          events={events}
          index={index}
          key={`extrinsic:${index}`}
          maxBlockWeight={api.consts.system.blockWeights?.maxBlock}
          value={extrinsic}
        />
      )}
    </Table>
  );
}

export default React.memo(Extrinsics);
