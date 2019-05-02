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

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: 5rem;
  top: 0.4rem;

  > div {
    max-width: 35rem;
  }

  .ui--Labelled label {
    display: none;
  }

  ${media.DESKTOP`
    .ui--Labelled label {
      display: flex;
    }
  `}
`;

export default class FilterOverlay extends React.PureComponent<Props> {
  render () {
    const { children } = this.props;

    return (
      <Wrapper>
        {children}
      </Wrapper>
    );
  }
}
