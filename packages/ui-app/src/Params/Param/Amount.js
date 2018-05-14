// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow
// flowlint sketchy-null-mixed:off,sketchy-null-number:off

import type { Props } from '../types';

import BN from 'bn.js';
import React from 'react';

import Input from '../../Input';
import Bare from './Bare';

export default class Amount extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, isDisabled, isError, label, style, value: { options: { initValue = 0, maxValue, minValue = 0 } = {} }, withLabel } = this.props;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className='small'
          defaultValue={initValue || minValue}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          max={maxValue}
          min={minValue}
          onChange={this.onChange}
          type='number'
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  onChange = (value: number): void => {
    const { index, onChange, value: { options: { minValue = 0 } = {} } } = this.props;

    onChange(index, {
      isValid: true,
      value: new BN(value || minValue || 0)
    });
  }
}
