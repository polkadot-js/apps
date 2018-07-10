// Copyright 2017-2018 @polkadot/app-example authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

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

    return (
      <div className='example--App'>
        <div className='navigation'>{
          Object.keys(Components).map((name) => (
            <a key={name} onClick={() => this.onSelect(name)}>{name}</a>
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
