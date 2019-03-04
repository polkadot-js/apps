// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import store from 'store';
import styled from 'styled-components';
import { getTypeRegistry } from '@polkadot/types';
import createApp from '@polkadot/ui-app/index';
import { classes } from '@polkadot/ui-app/util';
import Signer from '@polkadot/ui-signer/index';
import settings from '@polkadot/ui-settings';

import Connecting from './Connecting';
import Content from './Content';
import SideBar from './SideBar';

type Props = BareProps & {};

const Wrapper = styled.div`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  min-height: 100vh;
`;

function App (props: Props) {
  return (
    <Wrapper className={classes(`theme--${settings.uiTheme}`)}>
      <SideBar />
      <Signer>
        <Content />
      </Signer>
      <Connecting />
    </Wrapper>
  );
}

const url = process.env.WS_URL || settings.apiUrl || undefined;

console.log('Web socket url=', url);

try {
  const types = store.get('types') || {};
  const names = Object.keys(types);

  if (names.length) {
    getTypeRegistry().register(types);
    console.log('Type registration:', names.join(', '));
  }
} catch (error) {
  console.error('Type registration failed', error);
}

createApp(App, {
  url
});
