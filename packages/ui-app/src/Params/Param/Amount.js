// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import BN from 'bn.js';
import React from 'react';

import Input from '../../Input';
import Bare from './Bare';

export default class Amount extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    // flowlint-next-line unclear-type:off
    const defaultValue = new BN(((value: any): BN) || 0).toNumber();

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className='small'
          defaultValue={defaultValue || 0}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          min={0}
          onChange={this.onChange}
          type='number'
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  onChange = (value: string): void => {
    const { onChange } = this.props;

    onChange({
      isValid: true,
      value: new BN(value || 0)
    });
  }
}
