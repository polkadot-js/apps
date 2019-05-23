// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';

import BaseBytes from './BaseBytes';

export default class Hash extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isDisabled, isError, label, name, onChange, onEnter, style, type, withLabel } = this.props;

    return (
      <BaseBytes
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        length={32}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        size={isDisabled ? 'full' : 'large'}
        style={style}
        type={type}
        withLabel={withLabel}
      />
    );
  }
}
