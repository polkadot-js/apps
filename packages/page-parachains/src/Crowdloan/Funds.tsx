// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Campaign } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Fund from './Fund';

interface Props {
  bestNumber?: BN;
  className?: string;
  value: Campaign[] | null;
}

function Funds ({ bestNumber, className, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerActiveRef = useRef([
    [t('ongoing'), 'start', 4],
    [t('ending')],
    [t('slots')],
    [t('raised')],
    []
  ]);

  const headedEndedRef = useRef([
    [t('completed'), 'start', 4],
    [t('ended')],
    [t('slots')],
    [t('raised')]
  ]);

  return (
    <>
      <Table
        className={className}
        empty={value && t<string>('No active campaigns found')}
        header={headerActiveRef.current}
      >
        {value?.filter(({ isEnded }) => !isEnded).map((fund) => (
          <Fund
            bestNumber={bestNumber}
            isOngoing
            key={fund.paraId.toString()}
            value={fund}
          />
        ))}
      </Table>
      <Table
        className={className}
        empty={value && t<string>('No completed campaigns found')}
        header={headedEndedRef.current}
      >
        {value?.filter(({ isEnded }) => isEnded).map((fund) => (
          <Fund
            bestNumber={bestNumber}
            key={fund.paraId.toString()}
            value={fund}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Funds);
