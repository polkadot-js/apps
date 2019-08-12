// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

// this is disabled, Chrome + WASM memory leak makes it slow & laggy. If enabled
// we also need to export the default as hot(Apps) (last line)
// import { hot } from 'react-hot-loader/root';

import React from 'react';
import store from 'store';
import styled from 'styled-components';
import { media } from '@polkadot/react-components';
import Signer from '@polkadot/react-signer';
import settings from '@polkadot/ui-settings';

import ConnectingOverlay from './overlays/Connecting';
import AccountsOverlay from './overlays/Accounts';
import { SideBarTransition, SIDEBAR_TRANSITION_DURATION, SIDEBAR_MENU_THRESHOLD } from './constants';
import Content from './Content';
import SideBar from './SideBar';

type Props = BareProps;

interface State {
  isCollapsed: boolean;
  isMenu: boolean;
  menuOpen: boolean;
  transition: SideBarTransition;
}

class Apps extends React.Component<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    const state = store.get('sidebar') || {};

    this.state = {
      isCollapsed: false,
      menuOpen: false,
      transition: SideBarTransition.COLLAPSED,
      ...state
    };
  }

  public componentDidMount (): void {
    this.setState({
      menuOpen: false,
      isMenu: window.innerWidth < SIDEBAR_MENU_THRESHOLD
    });
  }

  public componentDidUpdate (): void {
    this.handleMenuTransition();
  }

  public render (): React.ReactNode {
    const { className } = this.props;
    const { isCollapsed, isMenu, menuOpen } = this.state;

    return (
      <div className={`apps-Wrapper ${isCollapsed ? 'collapsed' : 'expanded'} ${isMenu && 'fixed'} ${menuOpen && 'menu-open'} theme--${settings.uiTheme} ${className}`}>
        {this.renderMenuBg()}
        <SideBar
          collapse={this.collapse}
          handleResize={this.handleResize}
          menuOpen={menuOpen}
          isCollapsed={isCollapsed}
          toggleMenu={this.toggleMenu}
        />
        <Signer>
          <Content />
        </Signer>
        <ConnectingOverlay />
        <AccountsOverlay />
      </div>
    );
  }

  private collapse = (): void => {
    this.setState(({ isCollapsed }: State): Pick<State, never> => ({
      isCollapsed: !isCollapsed
    }), (): void => {
      store.set('sidebar', this.state);
    });
  }

  private handleResize = (): void => {
    const { isMenu, menuOpen } = this.state;
    const dir = window.innerWidth < SIDEBAR_MENU_THRESHOLD ? 'hide' : 'show';

    if (!menuOpen) {
      if ((isMenu && dir === 'hide') || (!isMenu && dir === 'show')) {
        return;
      }
    }

    const transition = (dir === 'hide')
      ? SideBarTransition.MINIMISED_AND_EXPANDED
      : SideBarTransition.EXPANDED_AND_MAXIMISED;

    this.toggleMenuResize(transition);
  }

  private handleMenuTransition = (): void => {
    const { transition } = this.state;

    switch (transition) {
      case SideBarTransition.MINIMISED_AND_EXPANDED:
        setTimeout((): void => {
          this.setState({
            isMenu: true,
            isCollapsed: false,
            transition: SideBarTransition.COLLAPSED
          });
        }, SIDEBAR_TRANSITION_DURATION);
        break;

      case SideBarTransition.EXPANDED_AND_MAXIMISED:
        setTimeout((): void => {
          this.setState({
            isMenu: false,
            isCollapsed: store.get('sidebar').isCollapsed,
            transition: SideBarTransition.EXPANDED
          });
        }, SIDEBAR_TRANSITION_DURATION);
        break;

      default:
        break;
    }
  }

  private renderMenuBg = (): React.ReactNode => {
    return (
      <div
        className={`apps-Menu-bg ${this.state.menuOpen ? 'open' : 'closed'}`}
        onClick={this.handleResize}
      >
      </div>
    );
  }

  private toggleMenu = (): void => {
    this.setState({
      isCollapsed: false,
      menuOpen: true
    });
  }

  private toggleMenuResize = (transition: SideBarTransition): void => {
    switch (transition) {
      case SideBarTransition.MINIMISED_AND_EXPANDED:
        this.setState({
          isMenu: true,
          menuOpen: false,
          transition: transition
        });
        break;

      case SideBarTransition.EXPANDED_AND_MAXIMISED:
        this.setState({
          menuOpen: false,
          transition: transition
        });
        break;

      default:
        this.setState(({ isCollapsed }: State): Pick<State, never> => ({
          isCollapsed: !isCollapsed
        }));
        break;
    }
  }
}

export default styled(Apps)`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  min-height: 100vh;

  header {
    margin-bottom: 1.4rem;
    text-align: center;

    ${media.TABLET`
      margin-bottom: 2rem;
   `}
  }
`;
