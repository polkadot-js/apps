// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import createApp from '@polkadot/ui-app';

import App from './App';

createApp(App, {
  url: process.env.WS_URL === null || process.env.WS_URL === ''
    ? undefined
    : process.env.WS_URL
});
