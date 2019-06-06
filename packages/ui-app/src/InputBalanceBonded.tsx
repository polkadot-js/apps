// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, BitLength } from './types';
import { DerivedFees, DerivedBalances } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React from 'react';
import { ApiProps } from '@polkadot/ui-api/types';
import { BitLengthOption } from '@polkadot/ui-app/constants';
import { calcSignatureLength } from '@polkadot/ui-signer/Checks';
import { InputNumber } from '@polkadot/ui-app';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { withCalls, withMulti, withApi } from '@polkadot/ui-api';
import { ZERO_BALANCE, ZERO_FEES } from '@polkadot/ui-signer/Checks/constants';

type Props = BareProps & ApiProps & {
  autoFocus?: boolean,
  balances_fees?: DerivedFees,
  balances_all?: DerivedBalances,
  controllerId: string,
  defaultValue?: BN | string,
  destination?: number,
  extrinsicProp: 'staking.bond' | 'staking.bondExtra' | 'staking.unbond',
  help?: React.ReactNode,
  isDisabled?: boolean,
  isError?: boolean,
  label?: any,
  onChange?: (value?: BN) => void,
  onEnter?: () => void,
  placeholder?: string,
  stashId: string,
  system_accountNonce?: BN,
  value?: BN | string,
  withEllipsis?: boolean,
  withLabel?: boolean,
  withMax?: boolean
};

type State = {
  maxBalance?: BN,
  extrinsic: SubmittableExtrinsic | null
};

const ZERO = new BN(0);
const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC as BitLength;

class InputBalanceBonded extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      extrinsic: null,
      maxBalance: ZERO
    };
  }
  render () {
    const { autoFocus, className, defaultValue, help, isDisabled, isError, label, onChange, onEnter, placeholder,style, value, withEllipsis, withLabel, withMax } = this.props;
    const { maxBalance } = this.state;

    return (
      <InputNumber
        autoFocus={autoFocus}
        className={className}
        bitLength={DEFAULT_BITLENGTH}
        defaultValue={defaultValue}
        help={help}
        isDisabled={isDisabled}
        isError={isError}
        isSi
        label={label}
        maxValue={maxBalance}
        onChange={onChange}
        onEnter={onEnter}
        placeholder={placeholder}
        style={style}
        value={value}
        withEllipsis={withEllipsis}
        withLabel={withLabel}
        withMax={withMax}
      />
    );
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
    const { balances_all, balances_fees, controllerId, destination } = this.props;
    const { extrinsic } = this.state;
    const hasLengthChanged = ((extrinsic && extrinsic.encodedLength) || 0) !== ((prevState.extrinsic && prevState.extrinsic.encodedLength) || 0);

    if ((controllerId && prevProps.controllerId !== controllerId) ||
      (prevProps.destination !== destination) ||
      (balances_fees !== prevProps.balances_fees) ||
      (balances_all !== prevProps.balances_all) ||
      hasLengthChanged
    ) {
      this.setMaxBalance();
    }
  }

  private setMaxBalance = () => {
    const { api, balances_fees = ZERO_FEES, balances_all = ZERO_BALANCE, controllerId, destination, extrinsicProp, system_accountNonce = ZERO } = this.props;
    const { transactionBaseFee, transactionByteFee } = balances_fees;
    const { freeBalance } = balances_all;
    let prevMax = new BN(0);
    let maxBalance = new BN(1);
    let extrinsic;

    while (!prevMax.eq(maxBalance)) {
      prevMax = maxBalance;

      if (extrinsicProp === 'staking.bond') {
        extrinsic = controllerId && (destination || destination === 0)
        ? api.tx.staking.bond(controllerId, prevMax, destination)
        : null;
      } else if (extrinsicProp === 'staking.unbond') {
        extrinsic = api.tx.staking.unbond(prevMax);
      } else if (extrinsicProp === 'staking.bondExtra') {
        extrinsic = api.tx.staking.bonExtra(prevMax);
      }

      const txLength = calcSignatureLength(extrinsic, system_accountNonce);
      const fees = transactionBaseFee
        .add(transactionByteFee.muln(txLength));

      maxBalance = new BN(freeBalance).sub(fees);
    }

    this.nextState({
      extrinsic,
      maxBalance
    });
  }

  private nextState (newState: Partial<State>): void {
    this.setState((prevState: State): State => {
      const { api, controllerId, destination, value } = this.props;
      const { maxBalance = prevState.maxBalance } = newState;
      const extrinsic = (value && controllerId && destination)
        ? api.tx.staking.bond(controllerId, value, destination)
        : null;

      return {
        extrinsic,
        maxBalance
      };
    });
  }
}

export default withMulti(
  InputBalanceBonded,
  withApi,
  withCalls<Props>(
    'derive.balances.fees',
    ['derive.balances.all', { paramName: 'stashId' }],
    ['query.system.accountNonce', { paramName: 'stashId' }]
  )
);
