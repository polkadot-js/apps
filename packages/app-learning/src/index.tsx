/* Copyright 2017-2019 @polkadot/app-learning authors & contributors
/* This software may be modified and distributed under the terms
/* of the Apache-2.0 license. See the LICENSE file for details. */

import { AppProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Route, Switch } from 'react-router';

import './index.css';

import translate from './translate';

import Header from './pages/common/Header';
import AboutPage from './pages/AboutPage';
import TracksPage from './pages/tracks/TracksPage';

type Props = AppProps & I18nProps;

type State = {};

class LearningApp extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { basePath } = this.props;

    return (
      <main className='learning--App'>
        <Header basePath={basePath} />
        <Switch>
          <Route component={TracksPage} />
          <Route path={`${basePath}/about`} component={AboutPage} />
        </Switch>
      </main>
    );
  }
}

export default translate(LearningApp);
