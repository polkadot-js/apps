// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props as BaseProps } from '@polkadot/ui-app/Params/types';

import React from 'react';

import BaseAccount from '../Account';

type Props = BaseProps & {
  defaultValue?: Uint8Array
};

export default class Account extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, defaultValue, isDisabled, isError, label, style, withLabel } = this.props;

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
    const { index, onChange } = this.props;

    onChange(index, {
      isValid: !!value && value.length === 32,
      value
    });
  }
}
