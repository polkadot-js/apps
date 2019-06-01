// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode,
  className?: string
};

class Column extends React.PureComponent<Props> {
  render () {
    const { children, className } = this.props;

    return (
      <article className={className}>
        {children}
      </article>
    );
  }
}

export default styled(Column)`
  margin: 0;
  padding: 0;

  article {
    border: none;
    margin: 0;
  }

  article+article {
    border-top: 1px solid #f2f2f2;
  }
`;
