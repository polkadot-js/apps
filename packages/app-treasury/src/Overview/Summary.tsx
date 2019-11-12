// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { withCalls } from '@polkadot/react-api';
import { formatBalance, formatNumber, stringToU8a } from '@polkadot/util';

import translate from '../translate';

const TREASURY_ACCOUNT = stringToU8a('modlpy/trsry'.padEnd(32, '\0'));

interface Props extends I18nProps {
  treasuryBalance?: BN;
  approvals?: BN[];
  proposalCount?: BN;
  pot?: BN;
}

function Summary ({ treasuryBalance, approvals, proposalCount, pot, t }: Props): React.ReactElement<Props> {
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
          {formatNumber(approvals?.length)}
        </CardSummary>
      </section>
      <section>
        {value && (
          <CardSummary label={t('available')}>
            {formatBalance(value, false)}{formatBalance.calcSi(value).value}
          </CardSummary>
        )}
      </section>
    </SummaryBox>
  );
}

export default translate(
  withCalls<Props>(
    ['query.balances.freeBalance', {
      params: [TREASURY_ACCOUNT],
      propName: 'treasuryBalance'
    }],
    ['query.treasury.approvals', { propName: 'approvals' }],
    ['query.treasury.proposalCount', { propName: 'proposalCount' }],
    ['query.treasury.pot', { propName: 'pot' }]
  )(Summary)
);
