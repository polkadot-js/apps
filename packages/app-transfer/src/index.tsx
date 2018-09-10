// Copyright 2017-2018 @polkadot/app-transfer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';

import './index.css';

type Props = BareProps & {
};

type State = {
};

export default class App extends React.PureComponent<Props, State> {
  render () {
    return (
      <main className='transfer--App'>
        hello world
      </main>
    );
  }
}
