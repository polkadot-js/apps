// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedContractFees } from '@polkadot/api-derive/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React from 'react';
import { Compact } from '@polkadot/types';

type Props = {
  endowment: BN | Compact,
  fees: DerivedContractFees,
  onChange: (fees: ExtraFees) => void
};

type State = ExtraFees & {};

export default class ContractCall extends React.PureComponent<Props, State> {
  state: State = {
    extraFees: new BN(0),
    extraAmount: new BN(0),
    extraWarn: false
  };

  static getDerivedStateFromProps ({ endowment, fees, onChange }: Props, state: State) {
    let extraFees = new BN(fees.callBaseFee);

    const extraAmount = endowment instanceof Compact ? endowment.toBn() : new BN(endowment || 0);

    const update = {
      extraAmount,
      extraFees,
      extraWarn: false
    };

    if (!update.extraAmount.eq(state.extraAmount) || !update.extraFees.eq(state.extraFees)) {
      onChange(update);
    }

    return update;
  }

  render () {
    return null;
  }
}
