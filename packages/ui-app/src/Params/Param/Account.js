// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';

import InputAddress from '../../InputAddress';
import Bare from './Bare';

export default class Account extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, isError, label, style, value: { options: { initValue } = {} } } = this.props;

    // flowlint-next-line unclear-type:off
    const defaultValue = ((initValue: any): Uint8Array);

    return (
      <Bare
        className={className}
        style={style}
      >
        <InputAddress
          className='large'
          defaultValue={defaultValue}
          isError={isError}
          isInput
          label={label}
          onChange={this.onChange}
          placeholder='5...'
        />
      </Bare>
    );
  }

  onChange = (value?: Uint8Array): void => {
    const { index, onChange } = this.props;

    onChange(index, {
      isValid: !!value && value.length === 32,
      value
    });
  }
}
