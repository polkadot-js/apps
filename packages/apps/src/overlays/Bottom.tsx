// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from '@polkadot/react-components';

import DotApps from './DotApps.js';
import LocalFork from './LocalFork.js';

interface Props {
  className?: string;
}

function Bottom ({ className }: Props): React.ReactElement<Props> | null {
  return (
    <StyledDiv className={className}>
      <LocalFork />
      <DotApps />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  position: fixed;
  bottom: 0.75rem;
  right: 0.75rem;
  left: 0.75rem;
  top: auto;
  padding: 1rem;
  z-index: 500;
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;;
  div.isInfo:before {
    content: none;
  }
`;

export default React.memo(Bottom);
