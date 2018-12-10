// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import createApp from '@polkadot/ui-app/index';
import Signer from '@polkadot/ui-signer/index';
import classes from '@polkadot/ui-app/util/classes';
import settings from '@polkadot/ui-settings';

import Connecting from './Connecting';
import Content from './Content';
import NodeInfo from './NodeInfo';
import SideBar from './SideBar';

type Props = BareProps & {};

function App (props: Props) {
  return (
    <div className={classes(`theme--${settings.uiTheme}`, 'apps--App')}>
      <SideBar>
        <NodeInfo />
      </SideBar>
      <Signer>
        <Content />
      </Signer>
      <Connecting />
    </div>
  );
}

const url = !settings.apiUrl
  ? undefined
  : settings.apiUrl;

console.log('Web socket url=', url);

createApp(App, {
  url
});
