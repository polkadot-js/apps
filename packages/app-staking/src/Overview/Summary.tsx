// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxBalance, RxBalanceMap } from '@polkadot/ui-react-rx/ApiObservable/types';

import BN from 'bn.js';
import React from 'react';
import CardSummary from '@polkadot/ui-app/CardSummary';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import SummarySession from '@polkadot/app-explorer/SummarySession';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import translate from '../translate';

type Props = I18nProps & {
  balances: RxBalanceMap,
  intentions: Array<string>,
  lastLengthChange?: BN,
  validatorCount?: BN,
  validators: Array<string>
};

class Summary extends React.PureComponent<Props> {
  render () {
    const { className, intentions, style, t, validatorCount, validators } = this.props;

    return (
      <summary
        className={className}
        style={style}
      >
        <section>
          <CardSummary label={t('summary.validators', {
            defaultValue: 'validators'
          })}>
            {validators.length}/{validatorCount ? validatorCount.toString() : '-'}
          </CardSummary>
          <CardSummary label={t('summary.intentions', {
            defaultValue: 'intentions'
          })}>
            {intentions.length}
          </CardSummary>
        </section>
        <section>
          <SummarySession withBroken={false} />
        </section>
        <section>
          <CardSummary label={t('summary.balances', {
            defaultValue: 'balances'
          })}>
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

    return (
      <div className='staking--Summary-text'>
        <div>{t('summary.balance.validator', {
          defaultValue: 'lowest validator {{validatorLow}}',
          replace: {
            validatorLow: validatorLow && validatorLow.stakingBalance
              ? `${numberFormat(validatorLow.stakingBalance)} (+${numberFormat(validatorLow.nominatedBalance)})`
              : 'unknown'
          }
        })}</div>
        <div>{t('summary.balance.stake', {
          defaultValue: 'highest intention {{intentionHigh}}',
          replace: {
            intentionHigh: intentionHigh
              ? `${numberFormat(intentionHigh.stakingBalance)} (+${numberFormat(intentionHigh.nominatedBalance)})`
              : 'unknown'
          }
        })}</div>
      </div>
    );
  }

  private calcIntentionsHigh (): RxBalance | null {
    const { balances, intentions, validators } = this.props;

    return intentions.reduce((high: RxBalance | null, addr) => {
      const balance = validators.includes(addr) || !balances[addr]
        ? null
        : balances[addr];

      if (high === null || (balance && high.stakingBalance.lt(balance.stakingBalance))) {
        return balance;
      }

      return high;
    }, null);
  }

  private calcValidatorLow (): RxBalance | null {
    const { balances, validators } = this.props;

    return validators.reduce((low: RxBalance | null, addr) => {
      const balance = balances[addr] || null;

      if (low === null || (balance && low.stakingBalance.gt(balance.stakingBalance))) {
        return balance;
      }

      return low;
    }, null);
  }
}

export default withMulti(
  translate(Summary),
  withObservable('validatorCount')
);
