// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BareProps, RawParam } from '../types';

import React from 'react';

import BaseBytes from './BaseBytes';
import Static from './Static';

type Props = BareProps & {
  defaultValue: RawParam,
  withLabel?: boolean
};

export default class Unknown extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isDisabled, isError, label, name, onChange, onEnter, style, type } = this.props;

    if (isDisabled) {
      return <Static {...this.props} />;
    }

    return (
      <BaseBytes
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        length={-1}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        size='full'
        style={style}
        type={type}
        withLength={false}
      />
    );
  }
}
