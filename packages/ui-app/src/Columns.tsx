// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode,
  className?: string
};

class Columns extends React.PureComponent<Props> {
  render () {
    const { children, className } = this.props;

    return (
      <div className={className}>
        {children}
      </div>
    );
  }
}

export default styled(Columns)`
  @media (min-width: 1025px) {
    display: flex;
  }

  > div {
    flex: 1;
    margin: 1rem;
  }
`;
