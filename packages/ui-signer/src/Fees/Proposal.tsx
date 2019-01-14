// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesFees } from '@polkadot/ui-api/derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React from 'react';
import { Compact } from '@polkadot/types/codec';
import { withCall, withMulti } from '@polkadot/ui-api/index';
import { balanceFormat } from '@polkadot/ui-reactive/util/index';

import translate from '../translate';

type Props = I18nProps & {
  deposit: BN | Compact,
  fees: DerivedBalancesFees,
  query_democracy_minimumDeposit?: BN
  onChange: (fees: ExtraFees) => void
};
type State = ExtraFees & {
  isBelowMinimum: boolean
};

class Proposal extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      extraFees: new BN(0),
      extraAmount: new BN(0),
      extraWarn: false,
      isBelowMinimum: false
    };
  }

  static getDerivedStateFromProps ({ deposit, query_democracy_minimumDeposit = new BN(0), onChange }: Props): State {
    const extraAmount = new BN(deposit.toNumber());
    const isBelowMinimum = extraAmount.lt(query_democracy_minimumDeposit);

    const update = {
      extraAmount,
      extraFees: new BN(0),
      extraWarn: isBelowMinimum
    };

    onChange(update);

    return {
      ...update,
      isBelowMinimum
    };
  }

  render () {
    const { query_democracy_minimumDeposit = new BN(0), t } = this.props;
    const { extraAmount, isBelowMinimum } = this.state;

    return [
      isBelowMinimum
        ? <li key='belowmin'>{t('proposal.belowmin', {
          defaultValue: 'The deposit is below the {{minimum}} minimum required for the proposal to be evaluated',
          replace: {
            minimum: balanceFormat(query_democracy_minimumDeposit)
          }
        })}</li>
        : undefined,
      extraAmount.isZero()
        ? undefined
        : <li key='infodeposit'>{t('proposal.deposit', {
          defaultValue: 'The deposit of {{deposit}} will be reserved until the proposal is completed',
          replace: {
            deposit: balanceFormat(extraAmount)
          }
        })}</li>
    ];
  }
}

export default withMulti(
  Proposal,
  translate,
  withCall('query.democracy.minimumDeposit')
);
