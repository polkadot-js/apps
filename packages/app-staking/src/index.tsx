// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import classes from '@polkadot/ui-app/util/classes';

import './index.css';

import Summary from './Summary';

type Props = BareProps;

export default class App extends React.PureComponent<Props> {
  render () {
    const { className, style } = this.props;

    return (
      <div
        className={classes('staking--App', className)}
        style={style}
      >
        <Summary />
      </div>
    );
  }
}
