// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import Info from './Info';

interface Props {
  className?: string;
}

class Banner extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className } = this.props;
    const info = <Info />;

    if (!info) {
      return null;
    }

    return (
      <div className={className}>
        <div className='box'>
          <div className='info'>{info}</div>
        </div>
      </div>
    );
  }
}

export default styled(Banner)`
  padding: 0 0.5rem 0.5rem;

  .box {
    background: #fff6e5;
    border-left: 0.25rem solid darkorange;
    border-radius: 0 0.25rem 0.25rem 0;
    box-sizing: border-box;
    padding: 1rem 1.5rem;

    .info {
      max-width: 50rem;
    }
  }
`;
