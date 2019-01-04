// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';
import { decodeAddress } from '@polkadot/keyring';

import InputAddress from '../../InputAddress';
import Bare from './Bare';

export default class Account extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    const defaultValue = value && value.toString();

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

  private onChange = (value?: string): void => {
    const { onChange } = this.props;

    let isValid = false;

    if (value) {
      try {
        decodeAddress(value);

        isValid = true;
      } catch (err) {
        console.error(err);
      }
    }

    onChange && onChange({
      isValid,
      value
    });
  }
}
