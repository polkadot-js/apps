// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow
// flowlint sketchy-null-mixed:off,sketchy-null-number:off

import type { Props as BaseProps } from '../types';

import BN from 'bn.js';
import React from 'react';

import Input from '../../Input';
import Bare from './Bare';

type Props = BaseProps & {
  maxValue?: number,
  minValue?: number
};

export default class Amount extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, defaultValue: { value }, isDisabled, isError, label, maxValue, minValue = 0, style, withLabel } = this.props;
    const defaultValue = (value: BN).toNumber();

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className='small'
          defaultValue={defaultValue || minValue}
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
    const { onChange, minValue = 0 } = this.props;

    onChange({
      isValid: true,
      value: new BN(value || minValue)
    });
  }
}
