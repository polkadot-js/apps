// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types';
import { BareProps } from './types';

import React from 'react';
import keyring from '@polkadot/ui-keyring';

import { classes } from './util';

type Props = BareProps & {
  accountId: AccountId | AccountIndex | Address | string | Uint8Array | null,
  label?: string
};

export default class CryptoType extends React.PureComponent<Props> {
  render () {
    const { accountId, className, label = '' } = this.props;
    const current = accountId
        ? keyring.getPair(accountId.toString())
        : null;
    const type = current
      ? current.type
      : 'ed25519';

    return (
      <>
        <span className={classes('ui--CryptoType label-cryptotype', className)}>{label}</span>
        <span className={classes('ui--CryptoType result-cryptotype', className)}>{type}</span>
      </>
    );
  }
}
