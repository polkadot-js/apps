// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { SideBarTransition } from '@polkadot/ui-app/constants';

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
  isCollapsed: boolean,
  isMenu: boolean,
  menuOpen: boolean,
  transition: SideBarTransition
};

const Wrapper = styled.div`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  min-height: 100vh;
`;

class Apps extends React.Component<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const state = store.get('sidebar') || {};

    this.state = {
      isCollapsed: false,
      menuOpen: false,
      transition: SideBarTransition.COLLAPSED,
      ...state
    };
  }

  componentDidMount () {
    this.setState({
      menuOpen: false,
      isMenu: window.innerWidth >= SideBarTransition.MENU_THRESHOLD ? false : true
    });
  }

  componentDidUpdate () {
    this.handleMenuTransition(this.state);
  }

  render () {

    const { isCollapsed, isMenu, menuOpen } = this.state;
    return (
      <Wrapper
        className={
          classes('apps-Wrapper',
                   `${!isCollapsed ? `expanded` : `collapsed`}`,
                   `${isMenu ? `fixed` : ``}`,
                   `${menuOpen ? `menu-open` : ``}`,
                   `theme--${settings.uiTheme}`)
        }
      >
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

  private handleResize = (): void => {
    const { isMenu, menuOpen } = this.state;
    const dir = window.innerWidth < SideBarTransition.MENU_THRESHOLD && 'hide' || 'show';

    if (!menuOpen &&
      ((isMenu && dir === 'hide')
      || (isMenu === false && dir === 'show'))) {
      return;
    }

    const transition = (dir === 'hide')
      && SideBarTransition.MINIMISED_AND_EXPANDED
      || SideBarTransition.EXPANDED_AND_MAXIMISED;

    this.toggleMenuResize(transition);
  }

  private handleMenuTransition = (state: State): void => {
    const { transition } = this.state;

    switch (transition) {
      case SideBarTransition.MINIMISED_AND_EXPANDED:
        setTimeout(() => {
          this.setState({
            isMenu: true,
            isCollapsed: false,
            transition: SideBarTransition.COLLAPSED
          });
        }, SideBarTransition.TRANSITION_DURATION);
        break;

      case SideBarTransition.EXPANDED_AND_MAXIMISED:
        setTimeout(() => {
          this.setState(({ isMenu }: State) => ({
            isMenu: false,
            isCollapsed: store.get('sidebar').isCollapsed,
            transition: SideBarTransition.EXPANDED
          }));
        }, SideBarTransition.TRANSITION_DURATION);
        break;

      default:
        break;
    }
  }

  private renderMenuBg = () => {
    return (
      <div
        className={
          classes(
            'apps-Menu-bg',
            `${this.state.menuOpen ? `open` : `closed`}`)
          }
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
        this.setState(({ isMenu }: State) => ({
          isMenu: true,
          menuOpen: false,
          transition: transition
        }));
        break;

      case SideBarTransition.EXPANDED_AND_MAXIMISED:
        this.setState(({ isMenu }: State) => ({
          menuOpen: false,
          transition: transition
        }));
        break;

      default:
        this.setState(({ isCollapsed }: State) => ({
          isCollapsed: !isCollapsed
        }));
        break;
    }
  }
}

export default hot(Apps);
