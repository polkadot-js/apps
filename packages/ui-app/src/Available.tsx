// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { BareProps } from './types';

import React from 'react';
import { Available } from '@polkadot/ui-reactive';

import { classes } from './util';

export interface Props extends BareProps {
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

export default class AvailableDisplay extends React.PureComponent<Props> {
  public render (): React.ReactNode {
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
