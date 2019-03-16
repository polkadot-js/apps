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
  mobMenu?: boolean,
  mobMenuOpen: boolean,
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
      mobMenuOpen: false,
      transition: SideBarTransition.COLLAPSED,
      ...state
    };
  }

  componentDidMount () {
    this.setState({
      mobMenuOpen: false,
      mobMenu: window.innerWidth > 768 ? false : true
    });
  }

  componentDidUpdate () {
    this.handleMenuTransition(this.state);
  }

  render () {

    const { isCollapsed, mobMenu, mobMenuOpen } = this.state;
    return (
      <Wrapper
        className={
          classes('apps-Wrapper',
                   `${!isCollapsed ? `expanded` : `collapsed`}`,
                   `${mobMenu ? `fixed` : ``}`,
                   `${mobMenuOpen ? `menu-open` : ``}`,
                   `theme--${settings.uiTheme}`)
        }
      >
        {this.renderMenuBg()}
        <SideBar
          collapse={this.collapse}
          handleResize={this.handleResize}
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
    const { mobMenu, mobMenuOpen } = this.state;
    const dir = window.innerWidth < 768 && 'hide' || 'show';

    if (!mobMenuOpen &&
      ((mobMenu && dir === 'hide')
      || (mobMenu === false && dir === 'show'))) {
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
            mobMenu: true,
            isCollapsed: false,
            transition: SideBarTransition.COLLAPSED
          });
        }, SideBarTransition.TRANSITION_DURATION);
        break;

      case SideBarTransition.EXPANDED_AND_MAXIMISED:
        setTimeout(() => {
          this.setState(({ mobMenu }: State) => ({
            mobMenu: false,
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
            `${this.state.mobMenuOpen ? `open` : `closed`}`)
          }
        onClick={this.handleResize}
      >
      </div>
    );
  }

  private toggleMenu = (): void => {
    this.setState(({ mobMenu }: State) => ({
      isCollapsed: false,
      mobMenuOpen: true
    }));
  }

  private toggleMenuResize = (transition: SideBarTransition): void => {
    switch (transition) {
      case SideBarTransition.MINIMISED_AND_EXPANDED:
        this.setState(({ mobMenu }: State) => ({
          mobMenu: true,
          mobMenuOpen: false,
          transition: transition
        }));
        break;

      case SideBarTransition.EXPANDED_AND_MAXIMISED:
        this.setState(({ mobMenu }: State) => ({
          mobMenuOpen: false,
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
