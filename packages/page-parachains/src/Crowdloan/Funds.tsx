// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Campaign, LeasePeriod } from '../types';
import type { Contributed } from './types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useEventTrigger } from '@polkadot/react-hooks';

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
      value.filter(({ firstSlot, isCapped, isEnded, isWinner }) => !(isCapped || isEnded || isWinner) && currentPeriod.lt(firstSlot)),
      value.filter(({ firstSlot, isCapped, isEnded, isWinner }) => (isCapped || isEnded || isWinner) || currentPeriod.gte(firstSlot))
    ]
    : [null, null];
}

function Funds ({ bestNumber, className, leasePeriod, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const trigger = useEventTrigger([api.events.crowdloan.Contributed]);
  const [contributors, setContributors] = useState<Contributed[]>([]);

  const headerActiveRef = useRef([
    [t('ongoing'), 'start', 4],
    [t('ending')],
    [t('periods')],
    [t('raised')],
    [t('count')],
    []
  ]);

  const headedEndedRef = useRef([
    [t('completed'), 'start', 4],
    [t('retired')],
    [t('ending')],
    [t('periods')],
    [t('raised')],
    [t('count')],
    []
  ]);

  useEffect((): void => {
    trigger && value &&
      Promise
        .all(value.map(({ childKey }) => api.rpc.childstate.getKeys(childKey, '0x')))
        .then((all) => setContributors(
          all.map((keys, index) => ({
            accountIds: [], // keys.map((a) => encodeAddress(a)),
            count: keys.length,
            trieIndex: value[index].info.trieIndex
          }))
        ))
        .catch(console.error);
  }, [api, trigger, value]);

  const findContributions = useCallback(
    (trieIndex: BN) => contributors.find((c) => trieIndex.eq(c.trieIndex)),
    [contributors]
  );

  const [active, ended] = useMemo(
    () => extractLists(value, leasePeriod),
    [leasePeriod, value]
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
            contributed={findContributions(fund.info.trieIndex)}
            isOngoing
            key={fund.accountId}
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
            contributed={findContributions(fund.info.trieIndex)}
            key={fund.accountId}
            value={fund}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Funds);
