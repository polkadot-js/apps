// Copyright 2017-2018 @polkadot/app-example authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import Tut002 from './comp-002';
import Tut003 from './comp-003';
import Tut004 from './comp-004';
import Tut005 from './comp-005';

const Components: { [index: string]: React.ComponentType<any> } = {
  Tut002, Tut003, Tut004, Tut005
};

type State = {
  Component: React.ComponentType<any>
};

export default class App extends React.PureComponent<any, State> {
  constructor (props: any) {
    super(props);

    this.state = {
      Component: Tut002
    };
  }

  render () {
    const { Component } = this.state;

    // FIXME We really want to have a stylesheet here, no inline styles
    return (
      <div>
        <div style={{ marginBottom: '2em' }}>{
          Object.keys(Components).map((name) => (
            <a key={name} style={{ marginRight: '0.5em', cursor: 'pointer' }} onClick={() => this.onSelect(name)}>{name}</a>
          ))
        }</div>
        <div><Component /></div>
      </div>
    );
  }

  onSelect (name: string) {
    this.setState({
      Component: Components[name]
    });
  }
}
