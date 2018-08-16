// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import Page from '@polkadot/ui-app/Page';

import Proposals from './Proposals';
import Referendums from './Referendums';
import Summary from './Summary';

type Props = BareProps & {
  basePath: string
};

export default class App extends React.PureComponent<Props> {
  render () {
    return (
      <Page className='democracy--App'>
        <Summary />
        <Referendums />
        <Proposals />
      </Page>
    );
  }
}
