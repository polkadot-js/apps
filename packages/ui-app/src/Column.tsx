// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode,
  className?: string,
  header: React.ReactNode
};

class Column extends React.PureComponent<Props> {
  render () {
    const { children, className, header } = this.props;

    return (
      <div className={`ui--Column ${className}`}>
        <h1>{header}</h1>
        <article className='container'>
          {children}
        </article>
      </div>
    );
  }
}

export default styled(Column)`
  box-sizing: border-box;
  flex: 1 1;
  margin: 0;
  padding: 0.5rem;

  .container {
    margin: 0;
    padding: 0;

    article {
      border: none;
      margin: 0;
    }

    article+article {
      border-top: 1px solid #f2f2f2;
    }
  }

  @media (min-width: 1025px) {
    max-width: 50%;
    min-width: 50%;
  }
`;
