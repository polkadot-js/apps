// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Campaign, LeasePeriod } from '../types';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Fund from './Fund';

interface Props {
  bestNumber?: BN;
  className?: string;
  leasePeriod?: LeasePeriod;
  value: Campaign[] | null;
}

function extractLists (value: Campaign[] | null, leasePeriod?: LeasePeriod): [Campaign[] | null, Campaign[] | null] {
  const currentPeriod = leasePeriod?.currentPeriod;

  return value && currentPeriod
    ? [
      value.filter(({ firstSlot, isCapped, isEnded, isWinner }) => !(isCapped || isEnded || isWinner) && currentPeriod.lte(firstSlot)),
      value.filter(({ firstSlot, isCapped, isEnded, isWinner }) => (isCapped || isEnded || isWinner) || currentPeriod.gt(firstSlot))
    ]
    : [null, null];
}

function Funds ({ bestNumber, className, leasePeriod, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerActiveRef = useRef([
    [t('ongoing'), 'start', 2],
    [undefined, 'media--1400'],
    [],
    [t('ending')],
    [t('leases')],
    [t('raised')],
    [t('unique'), 'media--1100'],
    [undefined, 'badge'],
    []
  ]);

  const headedEndedRef = useRef([
    [t('completed'), 'start', 2],
    [undefined, 'media--1400'],
    [],
    [t('retired')],
    [t('ending'), 'media--1200'],
    [t('leases')],
    [t('raised')],
    [t('unique'), 'media--1100'],
    [undefined, 'badge'],
    []
  ]);

  const [active, ended] = useMemo(
    () => extractLists(value, leasePeriod),
    [leasePeriod, value]
  );

  return (
    <>
      <Table
        className={className}
        empty={value && active && t<string>('No active campaigns found')}
        header={headerActiveRef.current}
      >
        {active?.map((fund) => (
          <Fund
            bestNumber={bestNumber}
            isOngoing
            key={fund.accountId}
            value={fund}
          />
        ))}
      </Table>
      <Table
        className={className}
        empty={value && ended && t<string>('No completed campaigns found')}
        header={headedEndedRef.current}
      >
        {ended?.map((fund) => (
          <Fund
            bestNumber={bestNumber}
            key={fund.accountId}
            leasePeriod={leasePeriod}
            value={fund}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Funds);
