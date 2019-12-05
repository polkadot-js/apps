// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, trackStream } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  lastReward: BN;
  totalStaked: BN;
}

interface StakeInfo {
  percentage: string;
  staked: string | null;
}

function Summary ({ lastReward, t, totalStaked }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const totalInsurance = trackStream<Balance>(api.query.balances.totalIssuance, []);
  const [{ percentage, staked }, setStakeInfo] = useState<StakeInfo>({ percentage: '-', staked: null });
  const [total, setTotal] = useState<string | null>(null);

  useEffect((): void => {
    if (totalInsurance) {
      setTotal(totalInsurance.toString());
    }
  }, [totalInsurance]);

  useEffect((): void => {
    if (totalInsurance && totalStaked?.gtn(0)) {
      setStakeInfo({
        percentage: `${(totalStaked.muln(10_000).div(totalInsurance).toNumber() / 100).toFixed(2)}%`,
        staked: totalStaked.toString()
      });
    }
  }, [totalInsurance, totalStaked]);

  return (
    <SummaryBox>
      <section className='ui--media-small'>
        <CardSummary label={t('total staked')}>
          {
            staked
              ? `${formatBalance(staked, false)}${formatBalance.calcSi(staked).value}`
              : '-'
          }
        </CardSummary>
        <CardSummary label=''>/</CardSummary>
        <CardSummary label={t('total issuance')}>
          {
            total
              ? `${formatBalance(total, false)}${formatBalance.calcSi(total).value}`
              : '-'
          }
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

export default translate(Summary);
