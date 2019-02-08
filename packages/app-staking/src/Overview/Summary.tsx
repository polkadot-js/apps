// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances, DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary } from '@polkadot/ui-app/index';
import { formatBalance } from '@polkadot/ui-app/util';
import { withCall, withMulti } from '@polkadot/ui-api/index';

import translate from '../translate';

type Props = I18nProps & {
  balances: DerivedBalancesMap,
  intentions: Array<string>,
  lastLengthChange?: BN,
  staking_validatorCount?: BN,
  validators: Array<string>
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { className, intentions, style, t, staking_validatorCount, validators } = this.props;

    return (
      <summary
        className={className}
        style={style}
      >
        <section>
          <CardSummary label={t('validators')}>
            {validators.length}/{staking_validatorCount ? staking_validatorCount.toString() : '-'}
          </CardSummary>
          <CardSummary label={t('intentions')}>
            {intentions.length}
          </CardSummary>
        </section>
        <section className='ui--media-medium'>
          <SummarySession withBroken={false} />
        </section>
        <section className='ui--media-large'>
          <CardSummary label={t('balances')}>
            {this.renderBalances()}
          </CardSummary>
        </section>
      </summary>
    );
  }

  private renderBalances () {
    const { t } = this.props;
    const intentionHigh = this.calcIntentionsHigh();
    const validatorLow = this.calcValidatorLow();
    const nominatedLow = validatorLow && validatorLow.nominatedBalance.gtn(0)
      ? `(+${formatBalance(validatorLow.nominatedBalance)})`
      : '';
    const nominatedHigh = intentionHigh && intentionHigh.nominatedBalance.gtn(0)
      ? `(+${formatBalance(intentionHigh.nominatedBalance)})`
      : '';

    return (
      <div className='staking--Summary-text'>
        <div>{t('lowest validator {{validatorLow}}', {
          replace: {
            validatorLow: validatorLow && validatorLow.stakingBalance
              ? `${formatBalance(validatorLow.stakingBalance)} ${nominatedLow}`
              : '-'
          }
        })}</div>
        <div>{t('highest intention {{intentionHigh}}', {
          replace: {
            intentionHigh: intentionHigh
              ? `${formatBalance(intentionHigh.stakingBalance)} ${nominatedHigh}`
              : '-'
          }
        })}</div>
      </div>
    );
  }

  private calcIntentionsHigh (): DerivedBalances | null {
    const { balances, intentions, validators } = this.props;

    return intentions.reduce((high: DerivedBalances | null, addr) => {
      const balance = validators.includes(addr) || !balances[addr]
        ? null
        : balances[addr];

      if (high === null || (balance && high.stakingBalance.lt(balance.stakingBalance))) {
        return balance;
      }

      return high;
    }, null);
  }

  private calcValidatorLow (): DerivedBalances | null {
    const { balances, validators } = this.props;

    return validators.reduce((low: DerivedBalances | null, addr) => {
      const balance = balances[addr] || null;

      if (low === null || (balance && low.stakingBalance.gt(balance.stakingBalance))) {
        return balance;
      }

      return low;
    }, null);
  }
}

export default withMulti(
  Summary,
  translate,
  withCall('query.staking.validatorCount')
);
