// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { LeasePeriod } from '../types.js';

import React, { useMemo } from 'react';

import { BN_ONE, formatNumber } from '@polkadot/util';

import LeaseBlocks from './LeaseBlocks.js';

interface Props {
  className?: string;
  fromFirst?: boolean;
  leasePeriod?: LeasePeriod;
  periods: number[];
}

function getMapped (periods: number[], currentPeriod?: BN): string | undefined {
  return currentPeriod &&
    periods
      ?.reduce((all: [BN, BN][], period): [BN, BN][] => {
        const bnp = currentPeriod.addn(period);

        if (!all.length || all[all.length - 1][1].add(BN_ONE).lt(bnp)) {
          all.push([bnp, bnp]);
        } else {
          all[all.length - 1][1] = bnp;
        }

        return all;
      }, [])
      .map(([a, b]) =>
        a.eq(b)
          ? formatNumber(a)
          : `${formatNumber(a)} - ${formatNumber(b)}`
      )
      .join(', ');
}

function Periods ({ className, fromFirst, leasePeriod, periods }: Props): React.ReactElement<Props> {
  const mapped = useMemo(
    () => getMapped(periods, leasePeriod?.currentPeriod),
    [leasePeriod?.currentPeriod, periods]
  );

  return (
    <div className={className}>
      <div>{mapped}</div>
      {periods && (
        <LeaseBlocks
          leasePeriod={leasePeriod}
          value={
            fromFirst
              ? periods[0]
              : periods[periods.length - 1] + 1
          }
        />
      )}
    </div>
  );
}

export default React.memo(Periods);
