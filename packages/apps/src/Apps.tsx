// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import store from 'store';
import styled from 'styled-components';
import { classes } from '@polkadot/ui-app/util';
import Signer from '@polkadot/ui-signer';
import settings from '@polkadot/ui-settings';

import { hot } from 'react-hot-loader/root';

import Connecting from './Connecting';
import Content from './Content';
import SideBar from './SideBar';

type Props = BareProps & {};

type State = {
  isCollapsed: boolean
};

const Wrapper = styled.div`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  min-height: 100vh;
`;

class Apps extends React.Component<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const state = store.get('sidebar') || {};
    this.state = {
      isCollapsed: false,
      ...state
    };
  }

  render () {
    const { isCollapsed } = this.state;

    return (
      <Wrapper className={classes('apps-Wrapper', `${isCollapsed ? 'collapsed' : 'expanded'}`, `theme--${settings.uiTheme}`)}>
        <SideBar
          collapse={this.collapse}
          isCollapsed={isCollapsed}
        />
        <Signer>
          <Content />
        </Signer>
        <Connecting />
      </Wrapper>
    );
  }

  private collapse = (): void => {
    this.setState(({ isCollapsed }: State) => ({
      isCollapsed: !isCollapsed
    }), () => {
      store.set('sidebar', this.state);
    });
  }
}

export default hot(Apps);
