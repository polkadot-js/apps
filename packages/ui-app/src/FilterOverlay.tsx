// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

import media from './media';

type Props = BareProps & {
  children: React.ReactNode
};

class FilterOverlay extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, className } = this.props;

    return (
      <div className={className}>
        {children}
      </div>
    );
  }
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
