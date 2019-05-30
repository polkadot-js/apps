// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from 'styled-components';
import { media } from '@polkadot/ui-app';

export const Wrapper = styled.div`
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

export const TopBar = styled.div`
  background: #f2f2f2;
  font-size: 0.85rem;
  line-height: 1rem;
  overflow: hidden;
  padding: 0.5rem 1rem;
  position: fixed;
  right: 0;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
  top: 0;

  div {
    display: inline-block;
    vertical-align: middle;
  }

  > div {
    border-left: 1px solid #ccc;
    padding: 0 0.5rem;

    &:first-child {
      border-width: 0;
    }
  }
`;

export const Overlay = styled.div`
  bottom: 0;
  left: 0;
  line-height: 1.5em;
  padding: 1em 5em;
  position: fixed;
  right: 0;
  text-align: center;
  z-index: 500;
`;

export const OverlayClose = styled.div`
  cursor: pointer;
  position: absolute;
  right: 1em;
  top: 1em;
`;

export const Connecting = styled(Overlay)`
  background: red;
  color: white;
  opacity: 0.9;
`;

export const Accounts = styled(Overlay)`
  background: #FFFACD;
`;
