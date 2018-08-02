// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import storage from '@polkadot/storage';
import encodeAddress from '@polkadot/util-keyring/address/encode';
import classes from '@polkadot/ui-app/util/classes';
import withStorage from '@polkadot/ui-react-rx/with/storage';

import './index.css';

import StakeList from './StakeList';
import Summary from './Summary';

type Props = BareProps & {
  intentions?: Array<string>
};

class App extends React.PureComponent<Props> {
  render () {
    const { className, intentions = [], style } = this.props;

    return (
      <div
        className={classes('staking--App', className)}
        style={style}
      >
        <Summary intentions={intentions} />
        <StakeList intentions={intentions} />
      </div>
    );
  }
}

export default withStorage(
  storage.staking.public.intentions,
  {
    propName: 'intentions',
    transform: (intentions) =>
      intentions.map(encodeAddress)
  }
)(App);
