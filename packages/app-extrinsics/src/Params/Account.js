// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '@polkadot/ui-app/Params/types';

import React from 'react';

import BaseAccount from '../Account';

export default class Account extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    // flowlint-next-line unclear-type:off
    const defaultValue = ((value: any): Uint8Array);

    return (
      <BaseAccount
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        isInput
        label={label}
        onChange={this.onChange}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  onChange = (value?: Uint8Array): void => {
    const { onChange } = this.props;

    onChange({
      isValid: !!value && value.length === 32,
      value
    });
  }
}
