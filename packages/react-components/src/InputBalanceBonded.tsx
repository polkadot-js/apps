
// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, BitLength } from './types';
import { DeriveFees, DeriveBalancesAll } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React from 'react';
import { ApiProps } from '@polkadot/react-api/types';
import { BitLengthOption } from '@polkadot/react-components/constants';
import { InputNumber } from '@polkadot/react-components';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { withCalls, withMulti, withApi } from '@polkadot/react-api/hoc';

interface Props extends BareProps, ApiProps {
  autoFocus?: boolean;
  balances_fees?: DeriveFees;
  balances_all?: DeriveBalancesAll;
  controllerId: string;
  defaultValue?: BN | string;
  destination?: number;
  extrinsicProp: 'staking.bond' | 'staking.bondExtra' | 'staking.unbond';
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isZeroable?: boolean;
  label?: any;
  onChange?: (value?: BN) => void;
  onEnter?: () => void;
  onEscape?: () => void;
  placeholder?: string;
  stashId: string;
  value?: BN | string;
  withEllipsis?: boolean;
  withLabel?: boolean;
  withMax?: boolean;
}

interface State {
  maxBalance?: BN;
  extrinsic: SubmittableExtrinsic | null;
}

const ZERO = new BN(0);
const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC as BitLength;

class InputBalanceBonded extends React.PureComponent<Props, State> {
  public state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      extrinsic: null,
      maxBalance: ZERO
    };
  }

  public render (): React.ReactNode {
    const { autoFocus, className, defaultValue, help, isDisabled, isError, isFull, isZeroable, label, onChange, onEnter, onEscape, placeholder, style, value, withEllipsis, withLabel, withMax } = this.props;
    const { maxBalance } = this.state;

    return (
      <InputNumber
        autoFocus={autoFocus}
        bitLength={DEFAULT_BITLENGTH}
        className={className}
        defaultValue={defaultValue}
        help={help}
        isDisabled={isDisabled}
        isError={isError}
        isFull={isFull}
        isSi
        isZeroable={isZeroable}
        label={label}
        maxValue={maxBalance}
        onChange={onChange}
        onEnter={onEnter}
        onEscape={onEscape}
        placeholder={placeholder}
        style={style}
        value={value}
        withEllipsis={withEllipsis}
        withLabel={withLabel}
        withMax={withMax}
      />
    );
  }
}

export default withMulti(
  InputBalanceBonded,
  withApi,
  withCalls<Props>(
    'derive.balances.fees',
    ['derive.balances.all', { paramName: 'stashId' }]
  )
);
