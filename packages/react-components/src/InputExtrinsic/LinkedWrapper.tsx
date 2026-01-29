// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Labelled from '../Labelled.js';
import { styled } from '../styled.js';

interface Props {
  children: React.ReactNode;
  className?: string;
  label: React.ReactNode;
  withLabel?: boolean;
}

function LinkedWrapper ({ children, className = '', label, withLabel }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={className}>
      <Labelled
        label={label}
        withLabel={withLabel}
      >
        <div className='ui--DropdownLinked ui--row'>
          {children}
        </div>
      </Labelled>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .ui--DropdownLinked-Items {
    .text {
      box-sizing: border-box;
      display: flex !important;
      flex-wrap: nowrap;
      justify-content: space-between;
      overflow: hidden;
      position: relative;
      width: 100%;
      white-space: nowrap;
    }

    > .text {
      padding-left: 1em;
    }
  }

  .ui--DropdownLinked-Item-text,
  .ui--DropdownLinked-Item-call {
    display: inline-block;
  }

  .ui--DropdownLinked-Item-call {
    flex: 1 0;
    margin-right: 1rem;
    text-align: left;
    text-overflow: ellipsis;
  }

  .ui--DropdownLinked-Item-text {
    flex: 1;
    font-size: var(--font-size-small);
    opacity: var(--opacity-light);
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
  }

  > .ui--Labelled > label {
    text-transform: none;
  }
`;

export default React.memo(LinkedWrapper);
