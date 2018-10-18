// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';
import { decodeAddress } from '@polkadot/keyring';
import { Base } from '@polkadot/types/codec';

import InputAddress from '../../InputAddress';
import Bare from './Bare';

export default class Account extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    const defaultValue = value instanceof Base
      ? value.toString()
      : value as Uint8Array;

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

  onChange = (value?: string): void => {
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
