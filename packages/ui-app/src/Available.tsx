// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { AccountId, AccountIndex, Address } from '@polkadot/types';
import { Available } from '@polkadot/ui-reactive';

import { classes } from './util';

export type Props = BareProps & {
  label?: string,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null,
  withLabel?: boolean
};

export default class AvailableDisplay extends React.PureComponent<Props> {
  render () {
    const { params, className, label, style } = this.props;

    if (!params) {
      return null;
    }

    return (
      <Available
        className={classes('ui--Available', className)}
        label={label}
        params={params}
        style={style}
      />
    );
  }
}
