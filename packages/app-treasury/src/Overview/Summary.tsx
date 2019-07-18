/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { SummaryBox, CardSummary } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';
import { formatBalance, formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  treasury_proposalCount?: BN;
  treasury_approvals?: BN[];
  treasury_pot?: BN;
}

class Summary extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { treasury_proposalCount = new BN(0), treasury_approvals = [] as BN[], treasury_pot = new BN(0), t } = this.props;
    const value = treasury_pot
      ? treasury_pot.toString()
      : null;

    return (
      <SummaryBox>
        <section>
          <CardSummary label={t('proposals')}>
            {formatNumber(treasury_proposalCount)}
          </CardSummary>
          <CardSummary label={t('approved')}>
            {treasury_approvals ? treasury_approvals.length : '0'}
          </CardSummary>
        </section>
        <section>
          <CardSummary label={t('pot')}>
            {
              value
                ? `${formatBalance(value, false)}${treasury_pot.gtn(0) ? formatBalance.calcSi(value).value : ''}`
                : '-'
            }
          </CardSummary>
        </section>
      </SummaryBox>
    );
  }
}

export default translate(
  withCalls<Props>(
    'query.treasury.proposalCount',
    'query.treasury.approvals',
    'query.treasury.pot'
  )(Summary)
);
