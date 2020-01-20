// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  lastReward: BN;
  totalStaked: BN;
}

interface StakeInfo {
  percentage: string;
  staked: string | null;
}

export default function Summary ({ lastReward, totalStaked }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const totalInsurance = useCall<Balance>(api.query.balances.totalIssuance, []);
  const [{ percentage, staked }, setStakeInfo] = useState<StakeInfo>({ percentage: '-', staked: null });
  const [total, setTotal] = useState<string | null>(null);

  useEffect((): void => {
    if (totalInsurance) {
      setTotal(
        `${formatBalance(totalInsurance, false)}${formatBalance.calcSi(totalInsurance.toString()).value}`
      );
    }
  }, [totalInsurance]);

  useEffect((): void => {
    if (totalInsurance && totalStaked?.gtn(0)) {
      setStakeInfo({
        percentage: `${(totalStaked.muln(10000).div(totalInsurance).toNumber() / 100).toFixed(2)}%`,
        staked: `${formatBalance(totalStaked, false)}${formatBalance.calcSi(totalStaked.toString()).value}`
      });
    }
  }, [totalInsurance, totalStaked]);

  return (
    <SummaryBox>
      <section className='ui--media-small'>
        <CardSummary label={t('total staked')}>
          {staked || '-'}
        </CardSummary>
        <CardSummary label=''>/</CardSummary>
        <CardSummary label={t('total issuance')}>
          {total || '-'}
        </CardSummary>
      </section>
      <CardSummary label={t('staked')}>
        {percentage}
      </CardSummary>
      <CardSummary label={t('last reward')}>
        {
          lastReward.gtn(0)
            ? `${formatBalance(lastReward, false)}`
            : '-'
        }
      </CardSummary>
    </SummaryBox>
  );
}
