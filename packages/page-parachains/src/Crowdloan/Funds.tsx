// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Campaign } from './types';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Fund from './Fund';

interface Props {
  bestNumber?: BN;
  className?: string;
  value: Campaign[] | null;
}

function extractLists (value: Campaign[] | null): [Campaign[] | null, Campaign[] | null] {
  return value
    ? [value.filter(({ isEnded }) => !isEnded), value.filter(({ isEnded }) => isEnded)]
    : [null, null];
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

  const [active, ended] = useMemo(
    () => extractLists(value),
    [value]
  );

  return (
    <>
      <Table
        className={className}
        empty={active && t<string>('No active campaigns found')}
        header={headerActiveRef.current}
      >
        {active?.map((fund) => (
          <Fund
            bestNumber={bestNumber}
            isOngoing
            key={fund.key}
            value={fund}
          />
        ))}
      </Table>
      <Table
        className={className}
        empty={ended && t<string>('No completed campaigns found')}
        header={headedEndedRef.current}
      >
        {ended?.map((fund) => (
          <Fund
            bestNumber={bestNumber}
            key={fund.key}
            value={fund}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Funds);
