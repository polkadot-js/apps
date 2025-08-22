// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Spinner, styled } from '@polkadot/react-components';
import GlobalStyle from '@polkadot/react-components/styles';
import { useTheme } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import BaseOverlay from './Base.js';

const BeforeApiInit = () => {
  const { themeClassName } = useTheme();
  const { t } = useTranslation();

  return (
    <>
      <GlobalStyle />
      <StyledDiv className={` apps--Wrapper ${themeClassName}`}>
        <BaseOverlay
          icon='globe'
          type='info'
        >
          <div>{t('Waiting to establish a connection with the remote endpoint.')}</div>
        </BaseOverlay>
        <div className='connecting'>
          <Spinner label='Initializing connection' />
        </div>
        <div id={'portals'} />
      </StyledDiv>
    </>
  );
};

const StyledDiv = styled.div`
  background: var(--bg-page);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  .connecting {
    padding-block: calc(3.5rem + 56px);
  }

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

export default BeforeApiInit;
