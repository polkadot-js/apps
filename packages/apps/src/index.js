// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import createApp from '@polkadot/ui-react-app/src';

import App from './App';
import NotFound from './NotFound';
import routing from './routing';
import urlParams from './urlParams';

createApp((() => {
  const { app } = urlParams();

  if (app) {
    const route = routing.routes.find(({ name }) => name === app);

    return route
      ? route.component
      : NotFound;
  }

  return App;
})());
