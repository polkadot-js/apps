// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps as Props } from '@polkadot/react-components/types';

import React, { useCallback, useMemo, useState } from 'react';
import store from 'store';
import styled from 'styled-components';
import { defaultColor, chainColors, emptyColor, nodeColors } from '@polkadot/apps-config/ui/general';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi } from '@polkadot/react-hooks';
import Signer from '@polkadot/react-signer';

import AccountsOverlay from './overlays/Accounts';
import ConnectingOverlay from './overlays/Connecting';
import { SideBarTransition, SIDEBAR_MENU_THRESHOLD } from './constants';
import Content from './Content';
import SideBar from './SideBar';
import WarmUp from './WarmUp';

interface SidebarState {
  isCollapsed: boolean;
  isMenu: boolean;
  isMenuOpen: boolean;
  transition: SideBarTransition;
}

export const PORTAL_ID = 'portals';

function sanitize (value?: string): string {
  return value?.toLowerCase().replace('-', ' ') || '';
}

function Apps ({ className }: Props): React.ReactElement<Props> {
  const { systemChain, systemName } = useApi();
  const [sidebar, setSidebar] = useState<SidebarState>({
    isCollapsed: false,
    isMenuOpen: false,
    transition: SideBarTransition.COLLAPSED,
    ...store.get('sidebar', {}),
    isMenu: window.innerWidth < SIDEBAR_MENU_THRESHOLD
  });
  const uiHighlight = useMemo((): string => {
    return chainColors[sanitize(systemChain)] || nodeColors[sanitize(systemName)] || emptyColor;
  }, [systemChain, systemName]);
  const { isCollapsed, isMenu, isMenuOpen } = sidebar;

  const _setSidebar = useCallback(
    (update: Partial<SidebarState>): void =>
      setSidebar((sidebar: SidebarState) =>
        store.set('sidebar', { ...sidebar, ...update })
      ),
    []
  );
  const _collapse = useCallback(
    (): void => _setSidebar({ isCollapsed: !isCollapsed }),
    [isCollapsed]
  );
  const _toggleMenu = useCallback(
    (): void => _setSidebar({ isCollapsed: false, isMenuOpen: true }),
    []
  );
  const _handleResize = useCallback(
    (): void => {
      const transition = window.innerWidth < SIDEBAR_MENU_THRESHOLD
        ? SideBarTransition.MINIMISED_AND_EXPANDED
        : SideBarTransition.EXPANDED_AND_MAXIMISED;

      _setSidebar({
        isMenu: transition === SideBarTransition.MINIMISED_AND_EXPANDED,
        isMenuOpen: false,
        transition
      });
    },
    []
  );

  return (
    <>
      <GlobalStyle uiHighlight={defaultColor || uiHighlight} />
      <div className={`apps--Wrapper ${isCollapsed ? 'collapsed' : 'expanded'} ${isMenu && 'fixed'} ${isMenuOpen && 'menu-open'} theme--default ${className}`}>
        <div
          className={`apps--Menu-bg ${isMenuOpen ? 'open' : 'closed'}`}
          onClick={_handleResize}
        />
        <SideBar
          collapse={_collapse}
          handleResize={_handleResize}
          isCollapsed={isCollapsed}
          isMenuOpen={isMenuOpen}
          toggleMenu={_toggleMenu}
        />
        <Signer>
          <Content />
        </Signer>
        <ConnectingOverlay />
        <AccountsOverlay />
        <div id={PORTAL_ID} />
      </div>
      <WarmUp />
    </>
  );
}

export default styled(Apps)`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  min-height: 100vh;

  &.theme--default {
    a.apps--SideBar-Item-NavLink {
      color: #f5f5f5;
      display: block;
      padding: 0.75em 0.75em;
      white-space: nowrap;

      &:hover {
        background: #5f5f5f;
        border-radius: 0.28571429rem 0 0 0.28571429rem;
        color: #eee;
        margin-right: 0.25rem;
      }
    }

    a.apps--SideBar-Item-NavLink-active {
      background: #fafafa;
      border-radius: 0.28571429rem 0 0 0.28571429rem;
      // border-bottom: 2px solid transparent;
      color: #3f3f3f;

      &:hover {
        background: #fafafa;
        color: #3f3f3f;
        margin-right: 0;
      }
    }
  }

  &.collapsed .apps--SideBar {
    text-align: center;

    .divider {
      display: none;
    }

    .apps--SideBar-Item {
      margin-left: 5px;

      .text {
        display: none;
      }
    }

    .apps--SideBar-logo {
      .apps--SideBar-logo-inner {
        margin: auto;
        padding: 0;
        width: 3rem;

        img {
          margin: 0 0.4rem;
        }

        > div.info {
          display: none;
        }
      }
    }

    .apps--SideBar-collapse .ui.basic.secondary.button {
      left: 0.66rem;
    }
  }

  &.expanded .apps--SideBar {
    text-align: left;

    .apps--SideBar-Scroll {
      padding-left: 0.75rem;
    }
  }

  &.fixed {
    .apps--SideBar-Wrapper {
      position: absolute;
      width: 0px;

      .apps--SideBar {
        padding-left: 0;
      }
    }
  }

  &.menu-open {
    .apps--SideBar-Wrapper {
      width: 12rem;
    }
  }

  .apps--Menu-bg {
    background: transparent;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transition: opacity 0.2s;
    width: 100%;
    z-index: 299;

    &.closed {
      opacity: 0;
      width: 0;
    }

    &.open {
      opacity: 1;
    }
  }
`;
