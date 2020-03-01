// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  lastReward: BN;
  numNominators: number;
  numValidators: number;
  totalStaked: BN;
}

interface StakeInfo {
  percentage: string;
}

export default function Summary ({ lastReward, numNominators, numValidators, totalStaked }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const totalInsurance = useCall<Balance>(api.query.balances.totalIssuance, []);
  const [{ percentage }, setStakeInfo] = useState<StakeInfo>({ percentage: '-' });

  useEffect((): void => {
    if (totalInsurance && totalStaked?.gtn(0)) {
      setStakeInfo({
        percentage: `${(totalStaked.muln(10000).div(totalInsurance).toNumber() / 100).toFixed(2)}%`
      });
    }
  }, [totalInsurance, totalStaked]);

  return (
    <SummaryBox>
      <section className='ui--media-small'>
        <CardSummary label={t('total staked')}>
          <FormatBalance
            value={totalStaked}
            withSi
          />
        </CardSummary>
        <CardSummary label=''>/</CardSummary>
        <CardSummary label={t('total issuance')}>
          <FormatBalance
            value={totalInsurance}
            withSi
          />
        </CardSummary>
      </section>
      <CardSummary label={t('staked')}>
        {percentage}
      </CardSummary>
      <CardSummary label={t('validators/nominators')}>
        {numValidators}/{numNominators}
      </CardSummary>
      <CardSummary label={t('last reward')}>
        <FormatBalance
          value={lastReward}
          withSi
        />
      </CardSummary>
    </SummaryBox>
  );
}
