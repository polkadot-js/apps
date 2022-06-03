// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyApi } from './hooks/useBounties';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useTreasury } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN, formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  info: BountyApi;
}

function Summary ({ className = '', info: { bestNumber, bounties, bountyCount, childCount } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { spendPeriod } = useTreasury();

  const totalValue = useMemo(
    () => (bounties || []).reduce((total, { bounty: { value } }) => total.iadd(value), new BN(0)),
    [bounties]
  );

  return (
    <SummaryBox className={`ui--BountySummary ${className}`}>
      <section>
        {bounties && (
          <CardSummary label={t<string>('active')}>
            {formatNumber(bounties.length)}
          </CardSummary>
        )}
        {bountyCount && bounties && (
          <CardSummary label={t<string>('past')}>
            {formatNumber(bountyCount.subn(bounties.length))}
          </CardSummary>
        )}
        {childCount && (
          <CardSummary label={t<string>('children')}>
            {formatNumber(childCount)}
          </CardSummary>
        )}
      </section>
      <section>
        <CardSummary label={t<string>('active total')}>
          <FormatBalance
            value={totalValue}
            withSi
          />
        </CardSummary>
      </section>
      <section>
        {bestNumber && !spendPeriod.isZero() && (
          <CardSummary
            label={t<string>('funding period')}
            progress={{
              total: spendPeriod,
              value: bestNumber.mod(spendPeriod),
              withTime: true
            }}
          />
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
