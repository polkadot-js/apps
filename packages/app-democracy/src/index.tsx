// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import Proposals from './Proposals';
import Referendums from './Referendums';
import Summary from './Summary';

type Props = AppProps & BareProps;

export default class App extends React.PureComponent<Props> {
  render () {
    return (
      <main className='democracy--App'>
        <Summary />
        <Referendums />
        <Proposals />
      </main>
    );
  }
}
