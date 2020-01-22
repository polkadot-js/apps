// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps as Props } from '@polkadot/react-components/types';

// this is disabled, Chrome + WASM memory leak makes it slow & laggy. If enabled
// we also need to export the default as hot(Apps) (last line)
// import { hot } from 'react-hot-loader/root';

import React, { useEffect, useState } from 'react';
import store from 'store';
import styled from 'styled-components';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi, useCall } from '@polkadot/react-hooks';
import Signer from '@polkadot/react-signer';

import AccountsOverlay from './overlays/Accounts';
import ConnectingOverlay from './overlays/Connecting';
import UpgradeOverlay from './overlays/Upgrade';
import { SideBarTransition, SIDEBAR_MENU_THRESHOLD } from './constants';
import Content from './Content';
import SideBar from './SideBar';

interface SidebarState {
  isCollapsed: boolean;
  isMenu: boolean;
  isMenuOpen: boolean;
  transition: SideBarTransition;
}

function WarmUp (): React.ReactElement {
  const { api, isApiReady } = useApi();
  const fees = useCall<any>(isApiReady ? api.derive.balances.fees : undefined, []);
  const indexes = useCall<any>(isApiReady ? api.derive.accounts.indexes : undefined, []);
  const registrars = useCall<any>(isApiReady ? api.query.identity?.registrars : undefined, []);
  const staking = useCall<any>(isApiReady ? api.derive.staking.overview : undefined, []);
  const [hasValues, setHasValues] = useState(false);

  useEffect((): void => {
    setHasValues(!!fees || !!indexes || !!registrars || !!staking);
  }, []);

  return (
    <div className={`api-warm ${hasValues}`} />
  );
}

function Apps ({ className }: Props): React.ReactElement<Props> {
  const [sidebar, setSidebar] = useState<SidebarState>({
    isCollapsed: false,
    isMenuOpen: false,
    transition: SideBarTransition.COLLAPSED,
    ...store.get('sidebar', {}),
    isMenu: window.innerWidth < SIDEBAR_MENU_THRESHOLD
  });
  const { isCollapsed, isMenu, isMenuOpen } = sidebar;

  const _setSidebar = (update: Partial<SidebarState>): void =>
    setSidebar(store.set('sidebar', { ...sidebar, ...update }));
  const _collapse = (): void =>
    _setSidebar({ isCollapsed: !isCollapsed });
  const _toggleMenu = (): void =>
    _setSidebar({ isCollapsed: false, isMenuOpen: true });
  const _handleResize = (): void => {
    const transition = window.innerWidth < SIDEBAR_MENU_THRESHOLD
      ? SideBarTransition.MINIMISED_AND_EXPANDED
      : SideBarTransition.EXPANDED_AND_MAXIMISED;

    _setSidebar({
      isMenu: transition === SideBarTransition.MINIMISED_AND_EXPANDED,
      isMenuOpen: false,
      transition
    });
  };

  return (
    <>
      <GlobalStyle />
      <div className={`apps-Wrapper ${isCollapsed ? 'collapsed' : 'expanded'} ${isMenu && 'fixed'} ${isMenuOpen && 'menu-open'} theme--default ${className}`}>
        <div
          className={`apps-Menu-bg ${isMenuOpen ? 'open' : 'closed'}`}
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
        <UpgradeOverlay />
      </div>
      <WarmUp />
    </>
  );
}

export default styled(Apps)`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  min-height: 100vh;
`;
