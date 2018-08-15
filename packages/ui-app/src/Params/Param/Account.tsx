// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';

import InputAddress from '../../InputAddress';
import Bare from './Bare';

export default class Account extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    const defaultValue = value as Uint8Array;

    return (
      <Bare
        className={className}
        style={style}
      >
        <InputAddress
          className={isDisabled ? 'full' : 'large'}
          defaultValue={defaultValue}
          isDisabled={isDisabled}
          isError={isError}
          isInput
          label={label}
          onChange={this.onChange}
          placeholder='5...'
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  onChange = (value?: Uint8Array): void => {
    const { onChange } = this.props;

    onChange && onChange({
      isValid: !!value && value.length === 32,
      value
    });
  }
}
