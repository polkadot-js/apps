// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';
import { classes } from '@polkadot/ui-app/util';
import Signer from '@polkadot/ui-signer/index';
import settings from '@polkadot/ui-settings';

import { hot } from 'react-hot-loader/root';

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

function Apps (props: Props) {
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

export default hot(Apps);
