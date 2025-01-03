// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { Campaign, LeasePeriod } from '../types.js';

import React, { useMemo, useRef } from 'react';

import { MarkWarning, Table } from '@polkadot/react-components';
import { useBestHash, useIsParasLinked } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Fund from './Fund.js';

interface Props {
  bestNumber?: BN;
  className?: string;
  leasePeriod?: LeasePeriod;
  value: Campaign[] | null;
}

function extractLists (value: Campaign[] | null, leasePeriod?: LeasePeriod): [Campaign[] | null, Campaign[] | null, ParaId[] | null] {
  const currentPeriod = leasePeriod?.currentPeriod;
  let active: Campaign[] | null = null;
  let ended: Campaign[] | null = null;
  let allIds: ParaId[] | null = null;

  if (value && currentPeriod) {
    active = value.filter(({ firstSlot, isCapped, isEnded, isWinner }) =>
      !(isCapped || isEnded || isWinner) &&
      currentPeriod.lte(firstSlot)
    );
    ended = value.filter(({ firstSlot, isCapped, isEnded, isWinner }) =>
      (isCapped || isEnded || isWinner) ||
      currentPeriod.gt(firstSlot)
    );
    allIds = value.map(({ paraId }) => paraId);
  }

  return [active, ended, allIds];
}

function sortList (hasLinksMap: Record<string, boolean>, list?: Campaign[] | null): Campaign[] | null | undefined {
  return list?.sort(({ key: a }, { key: b }): number => {
    const aKnown = hasLinksMap[a] || false;
    const bKnown = hasLinksMap[b] || false;

    return aKnown === bKnown
      ? 0
      : aKnown
        ? -1
        : 1;
  });
}

function Funds ({ bestNumber, className, leasePeriod, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const bestHash = useBestHash();
  const [active, ended, allIds] = useMemo(
    () => extractLists(value, leasePeriod),
    [leasePeriod, value]
  );
  const hasLinksMap = useIsParasLinked(allIds);
  const [activeSorted, endedSorted] = useMemo(
    () => [sortList(hasLinksMap, active), sortList(hasLinksMap, ended)],
    [active, ended, hasLinksMap]
  );

  const headerActiveRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('ongoing'), 'start', 2],
    [undefined, 'media--800'],
    [undefined, 'media--2000'],
    [t('ending'), 'media--1200'],
    [t('leases')],
    [t('raised')],
    [t('count'), 'media--1100'],
    [undefined, 'media--1000']
  ]);

  const headedEndedRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('completed'), 'start', 2],
    [undefined, 'media--800'],
    [undefined, 'media--2000'],
    [t('ending'), 'media--1200'],
    [t('leases')],
    [t('raised')],
    [t('count'), 'media--1100'],
    [undefined, 'media--1000']
  ]);

  return (
    <>
      <MarkWarning
        className='warning centered'
        content={t('Do not transfer any funds directly to a specific account that is associated with a loan or a team. Use the "Contribute" action to record the contribution on-chain using the crowdloan runtime module. When the fund is dissolved, after either the parachain lease expires or the loan ending without winning, the full value will be returned to your account by the runtime. Funds sent directly to an account, without using the crowdloan functionality, may not be returned by the receiving account.')}
      />
      <Table
        className={className}
        empty={value && activeSorted && t('No active campaigns found')}
        header={headerActiveRef.current}
      >
        {activeSorted?.map((fund) => (
          <Fund
            bestHash={bestHash}
            bestNumber={bestNumber}
            isOngoing
            key={fund.accountId}
            value={fund}
          />
        ))}
      </Table>
      <Table
        className={className}
        empty={value && endedSorted && t('No completed campaigns found')}
        header={headedEndedRef.current}
      >
        {endedSorted?.map((fund) => (
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
