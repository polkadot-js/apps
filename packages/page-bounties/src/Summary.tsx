// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useTreasury } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN } from '@polkadot/util';

import { useBounties } from './hooks';
import { useTranslation } from './translate';

interface Props {
  activeBounties?: number;
  className?: string;
}

function Summary ({ activeBounties, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { bestNumber, bounties, bountyIndex } = useBounties();
  const { spendPeriod } = useTreasury();

  const totalValue = useMemo(
    () => (bounties || []).reduce((total, { bounty: { value } }) => total.iadd(value), new BN(0)),
    [bounties]
  );

  return (
    <SummaryBox className={`ui--BountySummary ${className}`}>
      <section>
        <CardSummary label={t<string>('active')}>
          {activeBounties}
        </CardSummary>
        {activeBounties !== undefined && (
          <CardSummary label={t<string>('past')}>
            {bountyIndex?.subn(activeBounties).toString()}
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
        {bestNumber && spendPeriod.gtn(0) && (
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
