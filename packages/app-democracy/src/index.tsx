// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';

import './index.css';

import React from 'react';

import Proposals from './Proposals';
import Referendums from './Referendums';
import Summary from './Summary';

type Props = BareProps & {
  basePath: string,
  onStatusChange: (status: ActionStatus) => void
};

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
