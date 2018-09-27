// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BitLength } from '../../types';
import { Props as BareProps } from '../types';

import BN from 'bn.js';
import React from 'react';

import { BitLengthOption } from '../../constants';
import InputNumber from '../../InputNumber';
import Bare from './Bare';

type Props = BareProps;

const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC as BitLength;

class Balance extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isError, label, style, withLabel } = this.props;
    const defaultValue = new BN(value as BN || '0').toString(10);

    return (
      <Bare
        className={className}
        style={style}
      >
        <InputNumber
          bitLength={DEFAULT_BITLENGTH}
          className='large'
          defaultValue={defaultValue || '0'}
          isError={isError}
          label={label}
          onChange={this.onChange}
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  onChange = (value: BN): void => {
    const { isError, onChange } = this.props;

    if (!onChange) {
      return;
    }

    onChange({
      isValid: !isError,
      value
    });
  }
}

export {
  Balance
};

export default Balance;
