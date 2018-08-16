// Copyright 2017-2018 @polkadot/app-example authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import Navigation from '@polkadot/ui-app/Navigation';
import Page from '@polkadot/ui-app/Page';

import './index.css';

import Tut002 from './comp-002';
import Tut003 from './comp-003';
import Tut004 from './comp-004';
import Tut005 from './comp-005';
import Tut006 from './comp-006';
import Tut007 from './comp-007';

const Components: { [index: string]: React.ComponentType<any> } = {
  Tut002, Tut003, Tut004, Tut005, Tut006, Tut007
};

type Props = BareProps & {
  basePath: string
};

type State = {
  Component: React.ComponentType<any>
};

export default class App extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      Component: Tut002
    };
  }

  render () {
    const { Component } = this.state;

    return (
      <Page className='example--App'>
        <Navigation className='navigation'>{
          Object.keys(Components).map((name) => (
            <a key={name} onClick={() => this.onSelect(name)}>{name}</a>
          ))
        }</Navigation>
        <div><Component /></div>
      </Page>
    );
  }

  onSelect (name: string) {
    this.setState({
      Component: Components[name]
    });
  }
}
