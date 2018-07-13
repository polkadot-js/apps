// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props } from '../types';

import isValidBalance from '../../util/isValidBalance';

import BN from 'bn.js';
import React from 'react';

import Input from '../../Input';
import Bare from './Bare';

export default class Balance extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    const defaultValue = String(new BN(String(value) || 0));

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className='large'
          defaultValue={defaultValue || String(0)}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          onChange={this.onChange}
          placeholder='<any number between 1 testnet DOT and the available testnet DOT balance minus 1>'
          type='text'
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  onChange = (value: string): void => {
    const { onChange } = this.props;

    const isValid = isValidBalance(value.trim());

    onChange({
      isValid,
      value: String(new BN(String(value.trim()) || '0'))
    });
  }
}
