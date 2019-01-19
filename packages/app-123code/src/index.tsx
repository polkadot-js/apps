// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import './index.css';

import translate from './translate';

type Props = AppProps & I18nProps;

type State = {};

class App extends React.PureComponent<Props, State> {
  render () {
    return (
      <main className='template--App'>empty</main>
    );
  }
}

export default translate(App);
