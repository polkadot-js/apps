// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import createApp from '@polkadot/ui-app/index';
import classes from '@polkadot/ui-app/util/classes';
import Signer from '@polkadot/ui-signer/index';

import Connecting from './Connecting';
import Content from './Content';
import NodeInfo from './NodeInfo';
import SideBar from './SideBar';

type Props = BareProps & {};

function App ({ className, style }: Props) {
  return (
    <div
      className={classes('apps--App', className)}
      style={style}
    >
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

createApp(App, {
  // tslint:disable-next-line
  url: (process.env.WS_URL === null) || (process.env.WS_URL === '')
    ? undefined
    : process.env.WS_URL
});
