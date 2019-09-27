// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

interface Props extends BareProps {
  children?: React.ReactNode;
  className?: string;
}

function SummaryBox ({ children, className }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default styled(SummaryBox)`
  align-items: stretch;
  border-radius: 4px;
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  margin-bottom: 1.4rem;

  > section {
    display: flex;
    flex: 0 1 auto;
    text-align: left;
  }

  details & {
    display: block;
    margin: 0.5rem 0.25rem;
    opacity: 0.75;
    outline: none;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap;

    + div {
      margin-top: 0.75rem;
    }
  }

  @media(max-width: 767px) {
    padding: 0;

    .ui--media-small {
      display: none !important;
    }
  }

  @media(min-width: 768px) {
    margin-bottom: 2.8rem;
  }

  .ui.label {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
`;
