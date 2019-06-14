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
    let type = 'unknown';

    try {
      const current = accountId
        ? keyring.getPair(accountId.toString())
        : null;

      if (current) {
        type = current.meta.isInjected
          ? 'injected'
          : current.type;
      }
    } catch (error) {
      // cannot determine, keep unknown
    }

    return (
      <div className={classes('ui--CryptoType', className)}>
        {label}{type}
      </div>
    );
  }
}
