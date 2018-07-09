// Copyright 2017-2018 @polkadot/app-example authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import React from 'react';

import Comp from './comp-005';

export default class App extends React.PureComponent<any> {
  render () {
    return (
      <div className='example--App'>
        <Comp />
      </div>
    );
  }
}
