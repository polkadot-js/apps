// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { DividerProps } from './types';

import React from 'react';

import classes from '../util/classes';

export default class ButtonDivider extends React.Component<DividerProps> {
  render () {
    const { className, style } = this.props;

    return (
      <div
        className={classes('ui button compact mini basic', className)}
        style={style}
      />
    );
  }
}
