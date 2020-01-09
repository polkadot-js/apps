// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

import media from './media';

interface Props extends BareProps {
  children: React.ReactNode;
}

function FilterOverlay ({ children, className }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default styled(FilterOverlay)`
  display: none;

  .ui--Labelled label {
    display: none;
  }

  ${media.DESKTOP`
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 5rem;
    top: 0.4rem;

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
`;
