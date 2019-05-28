// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

type Props = {
  buttons?: React.ReactNode,
  children: React.ReactNode,
  className?: string
};

class CardGrid extends React.PureComponent<Props> {
  render () {
    const { buttons, children, className } = this.props;

    return (
      <div className={className}>
        {buttons && (
          <div className='ui--CardGrid-buttons'>
            {buttons}
          </div>
        )}
        <div className='ui--CardGrid-grid'>
          {children}
          <div className='ui--CardGrid-spacer' />
        </div>
      </div>
    );
  }
}

export default styled(CardGrid)`
  .ui--CardGrid-grid {
    display: flex;
    flex-wrap: wrap;

    > .ui--CardGrid-spacer {
      flex: 1 1;
      margin: .25rem;
      padding: 1rem 1.5rem;
    }
  }
`;
