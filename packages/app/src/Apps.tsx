// Copyright 2017-2021 @polkadot/apps authors & contributors
// and @canvas-ui/app authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PORTAL_ID } from '@canvas-ui/app-config/settings';
import { getSystemChainColor } from '@canvas-ui/app-config/ui';
import { defaultColor } from '@canvas-ui/app-config/ui/general';
import { ScrollToTop } from '@canvas-ui/react-components';
import GlobalStyle from '@canvas-ui/react-components/styles';
import { BareProps as Props } from '@canvas-ui/react-components/types';
import { useApi } from '@canvas-ui/react-hooks';
import React, { useCallback, useMemo, useState } from 'react';
import store from 'store';
import styled from 'styled-components';

import { SIDEBAR_MENU_THRESHOLD, SideBarTransition } from './constants';
import Content from './Content';
import SideBar from './SideBar';
import WarmUp from './WarmUp';

interface SidebarState {
  isCollapsed: boolean;
  isMenu: boolean;
  isMenuOpen: boolean;
  transition: SideBarTransition;
}

function saveSidebar (sidebar: SidebarState): SidebarState {
  return store.set('sidebar', sidebar) as SidebarState;
}

function Apps ({ className = '' }: Props): React.ReactElement<Props> {
  const { systemChain, systemName } = useApi();
  const [sidebar, setSidebar] = useState<SidebarState>({
    isCollapsed: false,
    isMenuOpen: false,
    transition: SideBarTransition.COLLAPSED,
    ...store.get('sidebar', {}),
    isMenu: window.innerWidth < SIDEBAR_MENU_THRESHOLD
  });
  const uiHighlight = useMemo(
    (): string | undefined => getSystemChainColor(systemChain, systemName),
    [systemChain, systemName]
  );

  const _collapse = useCallback(
    (): void => setSidebar((sidebar: SidebarState) => saveSidebar({ ...sidebar, isCollapsed: !sidebar.isCollapsed })),
    []
  );
  const _toggleMenu = useCallback(
    (): void => setSidebar((sidebar: SidebarState) => saveSidebar({ ...sidebar, isCollapsed: false, isMenuOpen: true })),
    []
  );
  const _handleResize = useCallback(
    (): void => {
      const transition = window.innerWidth < SIDEBAR_MENU_THRESHOLD
        ? SideBarTransition.MINIMISED_AND_EXPANDED
        : SideBarTransition.EXPANDED_AND_MAXIMISED;

      setSidebar((sidebar: SidebarState) => saveSidebar({
        ...sidebar,
        isMenu: transition === SideBarTransition.MINIMISED_AND_EXPANDED,
        isMenuOpen: false,
        transition
      }));
    },
    []
  );

  const { isCollapsed, isMenuOpen } = sidebar;

  return (
    <>
      <ScrollToTop />
      <GlobalStyle uiHighlight={defaultColor || uiHighlight} />
      <div className={`app--Wrapper ${isCollapsed ? 'collapsed' : 'expanded'} ${isMenuOpen ? 'menu-open' : ''} theme--default ${className}`}>
        <div
          className={`app--Menu-bg ${isMenuOpen ? 'open' : 'closed'}`}
          onClick={_handleResize}
        />
        <SideBar
          collapse={_collapse}
          handleResize={_handleResize}
          isCollapsed={false}
          isMenuOpen={isMenuOpen}
          toggleMenu={_toggleMenu}
        />
        <Content />
        <div id={PORTAL_ID} />
      </div>
      <WarmUp />
    </>
  );
}

export default React.memo(styled(Apps)`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;

  &.theme--default {
    a.app--SideBar-Item-NavLink {
      border-radius: 0.25rem;
      color: var(--grey60);
      display: block;
      padding: 0.5rem 0.5rem;
      white-space: nowrap;

      .svg-inline--fa {
        float: right;
        color: var(--grey50);
      }

      &:hover {
        background: var(--grey40);
        border-radius: var(--btn-radius-default);
        color: var(--grey80);
        
        .svg-inline--fa {
        color: var(--grey80);
      }
      }
    }

    a.app--SideBar-Item-NavLink-active {
      background: var(--grey30);
      border-radius: 4px;
      /* border-bottom: 2px solid transparent; */
      color: var(--grey80);
      font-weight: 600;

      .svg-inline--fa {
        color: var(--grey80);
      }

      &:hover {
        background: var(--grey40);
        color: var(--grey80);
        /* margin-right: 0; */
      }
    }
  }

  &.collapsed .app--SideBar {
    text-align: center;

    .divider {
      display: none;
    }

    .app--SideBar-Item {
      margin-left: 5px;

      .text {
        display: none;
      }
    }

    .app--SideBar-logo {
      .app--SideBar-logo-inner {
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

    .app--SideBar-collapse .ui.basic.secondary.button {
      left: 0.66rem;
    }
  }

  &.expanded .app--SideBar {
    text-align: left;

    .app--SideBar-Scroll {
      padding: 1.5rem 1rem;
    }
  }

  &.fixed {
    .app--SideBar-Wrapper {
      position: absolute;
      width: 0px;

      .app--SideBar {
        padding-left: 0;
      }
    }
  }

  &.menu-open {
    .app--SideBar-Wrapper {
      width: 12rem;
    }
  }

  .app--Menu-bg {
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
`);
