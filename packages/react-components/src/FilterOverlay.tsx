// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import media from './media';

interface Props {
  children: React.ReactNode;
  className?: string;
}

function FilterOverlay ({ children, className }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default React.memo(styled(FilterOverlay)`
  display: none;

  .ui--Labelled label {
    display: none;
  }
  right: calc(50% - var(--width-half) + 1.5rem);

  ${media.DESKTOP`
    display: flex;
    justify-content: flex-end;
    position: absolute;
    top: 0.25rem;

    > div {
      max-width: 35rem !important;
    }

    .ui--Labelled label {
      display: flex;
    }

    .ui.selection.dropdown {
      white-space: nowrap;
    }

  `}

  @media (max-width: var(--width-full)) {
    right: 1.5rem;
  }
`);
