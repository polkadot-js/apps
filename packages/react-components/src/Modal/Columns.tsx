// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from '../styled.js';

interface Props {
  align?: 'center' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  hint?: React.ReactNode;
}

function Columns ({ align = 'left', children, className = '', hint }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={`${className} ui--Modal-Columns ${align}Align`}>
      <div className='ui--Modal-Columns-content'>{children}</div>
      {hint && (
        <div className='ui--Modal-Columns-hint'>{hint}</div>
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  &.centerAlign > div.ui--Modal-Columns-content {
    text-align: center;
  }

  &.rightAlign > div.ui--Modal-Columns-content {
    text-align: right;
  }

  &+& {
    margin-top: 0.25rem;
  }

  > div {
    padding: 0.25em 0;

    &:nth-child(1) {
      flex: 100%;
      max-width: 100%;
    }

    &:nth-child(2) {
      display: none;
      flex: 0%;
    }

    @media only screen and (min-width: 1024px) {
      &:nth-child(1),
      &:only-child {
        flex: 0 65%;
        max-width: 65%;
      }

      &:nth-child(2) {
        box-sizing: border-box;
        display: block;
        flex: 0 34%;
        font-size: var(--font-size-small);
        opacity: 0.75;
        padding: 0.25rem 0 0.25rem 0.5rem;
      }
    }
  }
`;

export default React.memo(Columns);
