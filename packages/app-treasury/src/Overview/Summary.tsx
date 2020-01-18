// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance, formatNumber, stringToU8a } from '@polkadot/util';

import { useTranslation } from '../translate';

const TREASURY_ACCOUNT = stringToU8a('modlpy/trsry'.padEnd(32, '\0'));

interface Props {
  approvalCount?: number;
  proposalCount?: number;
}

export default function Summary ({ approvalCount, proposalCount }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const pot = useCall<BN>(api.query.treasury.pot, []);
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber as any, []);
  const spendPeriod = api.consts.treasury.spendPeriod;
  const treasuryBalance = useCall<BN>(api.query.balances.freeBalance, [TREASURY_ACCOUNT]);

  const value = treasuryBalance?.gtn(0)
    ? treasuryBalance.toString()
    : pot?.gtn(0)
      ? pot.toString()
      : null;

  return (
    <SummaryBox>
      <section>
        <CardSummary label={t('proposals')}>
          {formatNumber(proposalCount)}
        </CardSummary>
        <CardSummary label={t('approved')}>
          {formatNumber(approvalCount)}
        </CardSummary>
      </section>
      <section>
        {value && (
          <CardSummary label={t('available')}>
            {formatBalance(value, false)}{formatBalance.calcSi(value).value}
          </CardSummary>
        )}
      </section>
      {bestNumber && spendPeriod?.gtn(0) && (
        <section>
          <CardSummary
            label={t('spend period')}
            progress={{
              total: spendPeriod,
              value: bestNumber.mod(spendPeriod)
            }}
          />
        </section>
      )}
    </SummaryBox>
  );
}
