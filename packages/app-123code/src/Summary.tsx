// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';

interface Props extends BareProps {
  children: React.ReactNode;
}

class Summary extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, className, style } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default styled(Summary)`
  opacity: 0.5;
  padding: 1rem 1.5rem;
`;
