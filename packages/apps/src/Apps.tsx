// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props, ThemeDef } from '@polkadot/react-components/types';

import React, { useContext, useMemo } from 'react';
import styled, { ThemeContext } from 'styled-components';

import AccountSidebar from '@polkadot/app-accounts/Sidebar';
import { getSystemColor } from '@polkadot/apps-config';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi } from '@polkadot/react-hooks';
import Signer from '@polkadot/react-signer';

import ConnectingOverlay from './overlays/Connecting';
import Content from './Content';
import Menu from './Menu';
import WarmUp from './WarmUp';

export const PORTAL_ID = 'portals';

function Apps ({ className = '' }: Props): React.ReactElement<Props> {
  const { theme } = useContext<ThemeDef>(ThemeContext);
  const { specName, systemChain, systemName } = useApi();

  const uiHighlight = useMemo(
    () => getSystemColor(systemChain, systemName, specName),
    [specName, systemChain, systemName]
  );

  return (
    <>
      <GlobalStyle uiHighlight={uiHighlight} />
      <div className={`apps--Wrapper theme--${theme} ${className}`}>
        <Menu />
        <AccountSidebar>
          <Signer>
            <Content />
          </Signer>
          <ConnectingOverlay />
          <div id={PORTAL_ID} />
        </AccountSidebar>
      </div>
      <WarmUp />
    </>
  );
}

export default React.memo(styled(Apps)`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`);
