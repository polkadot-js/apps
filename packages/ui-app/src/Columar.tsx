// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode,
  className?: string
};

class Columar extends React.PureComponent<Props> {
  render () {
    const { children, className } = this.props;

    return (
      <div className={`ui--Columnar ${className}`}>
        {children}
      </div>
    );
  }
}

export default styled(Columar)`
  display: flex;
  flex-wrap: wrap;

  .ui--Column {
    @media (min-width: 1025px) {
      max-width: 50%;
      min-width: 50%;
    }
  }
`;
