// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/react-components';
import { useApi, useStream } from '@polkadot/react-hooks';
import { formatBalance, formatNumber, stringToU8a } from '@polkadot/util';

import translate from '../translate';

const TREASURY_ACCOUNT = stringToU8a('modlpy/trsry'.padEnd(32, '\0'));

interface Props extends I18nProps {
  approvalCount?: number;
  proposalCount?: number;
}

function Summary ({ approvalCount, proposalCount, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const pot = useStream<BN>(api.query.treasury.pot, []);
  const treasuryBalance = useStream<BN>(api.query.balances.freeBalance, [TREASURY_ACCOUNT]);

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
    </SummaryBox>
  );
}

export default translate(Summary);
