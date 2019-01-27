// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import { classes } from '@polkadot/ui-app/util';

type Props = BareProps & {
  children: React.ReactNode
};

export default class Bare extends React.PureComponent<Props> {
  render () {
    const { children, className, style } = this.props;

    return (
      <div
        className={classes('ui--row', className)}
        style={style}
      >
        {children}
      </div>
    );
  }
}
