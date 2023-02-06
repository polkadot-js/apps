// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import AccountSidebar from '@polkadot/app-accounts/Sidebar';
import GlobalStyle from '@polkadot/react-components/styles';
import { useApi, useTheme } from '@polkadot/react-hooks';
import Signer from '@polkadot/react-signer';

import ConnectingOverlay from './overlays/Connecting';
import Content from './Content';
import Menu from './Menu';
import WarmUp from './WarmUp';

export const PORTAL_ID = 'portals';

function Apps ({ className = '' }: Props): React.ReactElement<Props> {
  const { themeClassName } = useTheme();
  const { apiEndpoint, isDevelopment } = useApi();

  const uiHighlight = useMemo(
    () => isDevelopment
      ? undefined
      : apiEndpoint?.ui.color,
    [apiEndpoint, isDevelopment]
  );

  return (
    <>
      <GlobalStyle uiHighlight={uiHighlight} />
      <StyledDiv className={`${className} apps--Wrapper ${themeClassName}`}>
        <Menu />
        <AccountSidebar>
          <Signer>
            <Content />
          </Signer>
          <ConnectingOverlay />
          <div id={PORTAL_ID} />
        </AccountSidebar>
      </StyledDiv>
      <WarmUp />
    </>
  );
}

const StyledDiv = styled.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  ${[
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24
  ].map((n) => `
    .greyAnim-${n} {
      animation: greyAnim${n} 2s;
    }

    @keyframes greyAnim${n} {
      0% { background: #a6a6a6; }
      50% { background: darkorange; }
      100% { background: #a6a6a6; }
    }
  `).join('')}
`;

export default React.memo(Apps);
