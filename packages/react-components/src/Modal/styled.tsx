// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import styled from 'styled-components';

import { BodyProps, ContentProps } from '@polkadot/react-components/Modal/types';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(96, 96, 96, 0.5);
`;

export const Body = styled.div<BodyProps>`
  margin-top: 30px;
  background: var(--bg-page);
  border-radius: 4px;
  box-shadow: none;

  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  max-width: ${({ size }) => size === 'large' ? '1080px' : '720px'};
  width: calc(100% - 16px);

  color: var(--color-text);
  font: var(--font-sans);
`;

export const Content = styled.div.attrs(({ className }) => ({ className }))<ContentProps>`
  padding: 1.5rem;
`;
