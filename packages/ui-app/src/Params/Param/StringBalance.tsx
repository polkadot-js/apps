// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';

import Input from '../../Input';
import Bare from './Bare';

export default class StringBalance extends React.PureComponent<Props> {
  render () {
    const { className, isDisabled, isError, label, style, withLabel } = this.props;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className='large'
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          onChange={this.onChange}
          placeholder='<any number between [0.000000000000001] and [available balance minus 1])>'
          type='text'
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  onChange = (value: string): void => {
    const { onChange } = this.props;

    const isValid = value.length !== 0;

    onChange({
      isValid,
      value
    });
  }
}
