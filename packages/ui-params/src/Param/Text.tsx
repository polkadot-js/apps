// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';
import { Input } from '@polkadot/ui-app';

import Bare from './Bare';

export default class Text extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, onEnter, style, withLabel } = this.props;
    const defaultValue = (value || '').toString();

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className='full'
          defaultValue={defaultValue}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          onChange={this.onChange}
          onEnter={onEnter}
          placeholder='<any string>'
          type='text'
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  private onChange = (value: string): void => {
    const { onChange } = this.props;
    const isValid = value.length !== 0;

    onChange && onChange({
      isValid,
      value
    });
  }
}
