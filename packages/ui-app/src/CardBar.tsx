// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';

import classes from './util/classes';

export type Props = BareProps & {
  children: React.ReactNode,
  expanded?: React.ReactNode
};

export default class CardBar extends React.PureComponent<Props> {
  render () {
    const { children, className, style } = this.props;

    return (
      <div
        className={classes('ui--CardBar', className)}
        style={style}
      >
        <div className='ui--CardBar-cards'>
          {children}
        </div>
        {this.renderExtra()}
      </div>
    );
  }

  private renderExtra () {
    const { expanded } = this.props;

    if (!expanded) {
      return null;
    }

    return (
      <div className='ui--CardBar-expanded'>
        {expanded}
      </div>
    );
  }
}
