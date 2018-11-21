// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BitLength } from '../../types';
import { Props as BareProps } from '../types';

import BN from 'bn.js';
import React from 'react';
import { balanceFormat } from '@polkadot/ui-react-rx/util/index';

import { BitLengthOption } from '../../constants';
import InputNumber from '../../InputNumber';
import Bare from './Bare';

type Props = BareProps;

const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC as BitLength;

class Balance extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    const defaultValue = isDisabled
      ? balanceFormat(value)
      : new BN(value as BN || '0').toString(10);

    return (
      <Bare
        className={className}
        style={style}
      >
        <InputNumber
          bitLength={DEFAULT_BITLENGTH}
          className='large'
          defaultValue={defaultValue || '0'}
          isDisabled={isDisabled}
          isError={isError}
          isSi
          label={label}
          onChange={this.onChange}
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  private onChange = (value?: BN): void => {
    const { isError, onChange } = this.props;

    if (!onChange) {
      return;
    }

    onChange({
      isValid: !isError && !!value,
      value
    });
  }
}

export {
  Balance
};

export default Balance;
