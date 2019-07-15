// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { AccountId, AccountIndex, Address } from '@polkadot/types';
import { Nonce } from '@polkadot/ui-reactive';

import { classes } from './util';

export interface Props extends BareProps {
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

export default class NonceDisplay extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, label, params, style } = this.props;

    if (!params) {
      return null;
    }

    return (
      <Nonce
        className={classes('ui--Nonce', className)}
        label={label}
        params={params.toString()}
        style={style}
      />
    );
  }
}
