// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode,
  className?: string
};

class Card extends React.PureComponent<Props> {
  render () {
    const { children, className } = this.props;

    return (
      <article className={className}>
        {children}
      </article>
    );
  }
}

export default styled(Card)`
  position: relative;
  flex: 1 1;
  min-width: 24%;
  max-width: 24%;
  justify-content: space-around;

  .ui--AddressSummary-buttons {
    text-align: right;
    margin-bottom: 2em;

    button {
      margin-left: 0.2em;
    }
  }

  @media (max-width: 2060px) {
    min-width: 32%;
    max-width: 32%;
  }

  @media (max-width: 1580px) {
      min-width: 49%;
      max-width: 49%;
  }

  @media (max-width: 1100px) {
    min-width: 100%;
    max-width: 100%;
  }
`;
