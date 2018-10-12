// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props } from '@polkadot/ui-app/Params/types';

import React from 'react';

import BaseAccount from '../Account';

import addressDecode from '@polkadot/keyring/address/decode';

export default class Account extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    const defaultValue = (value as string);

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

  onChange = (accountId: string): void => {
    const { onChange } = this.props;

    let publicKey;

    try {
      publicKey = addressDecode(accountId);
    } catch (err) {
      console.error(err);
    }

    onChange && onChange({
      isValid: !!publicKey && publicKey.length === 32,
      value: accountId
    });
  }
}
