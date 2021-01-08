// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyIndex } from '@polkadot/types/interfaces';

import React from 'react';

import { useTranslation } from '@polkadot/app-treasury/translate';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import Progress from '@polkadot/react-components/Progress';
import { useApi, useCall } from '@polkadot/react-hooks';
import { useTreasury } from '@polkadot/react-hooks/useTreasury';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { Balance } from '@polkadot/types/interfaces';

interface Props {
  activeBounties?: number;
  className?: string;
}

function Summary ({ activeBounties, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const bountyIndex = useCall<BountyIndex>((api.query.bounties || api.query.treasury).bountyCount);
  const bestNumber = useCall<Balance>(api.derive.chain.bestNumber);

  const { burn, spendPeriod, value } = useTreasury();

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
        {bestNumber && spendPeriod.gtn(0) && (
          <CardSummary label={t<string>('next bounty funding in')}>
            <BlockToTime
              blocks={spendPeriod.sub(bestNumber.mod(spendPeriod))}
              className='timer'
            />
          </CardSummary>
        )}
      </section>
      <section>
        {value && (
          <CardSummary label={t<string>('treasury')}>
            <FormatBalance
              value={value}
              withSi
            />
          </CardSummary>
        )}
        {burn && (
          <CardSummary
            label={t<string>('next burn')}
          >
            <FormatBalance
              value={burn}
              withSi
            />
          </CardSummary>
        )}
        {spendPeriod.gtn(0) && (
          <CardSummary
            label={t<string>('spend period')}
          >
            <BlockToTime
              blocks={spendPeriod}
              className='timer'
            />
          </CardSummary>
        )}
        {bestNumber && spendPeriod.gtn(0) && (
          <Progress
            className='media--1000'
            total={spendPeriod}
            value={bestNumber.mod(spendPeriod)}
          />
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
