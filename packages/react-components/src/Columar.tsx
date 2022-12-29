// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  className?: string;
  is60?: boolean;
  isFull?: boolean;
  isPadded?: boolean;
}

interface ColumnProps {
  children: React.ReactNode;
  className?: string;
}

type ColumarType = React.ComponentType<Props> & {
  Column: React.ComponentType<ColumnProps>;
};

const MAX_WIDTH = '1025px';

function Column ({ children, className = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Column ${className}`}>
      {children}
    </div>
  );
}

function Columar ({ children, className = '', is60, isFull, isPadded = true }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Columar ${isFull ? 'isFull' : is60 ? 'is60' : 'is50'} ${isPadded ? 'isPadded' : ''} ${className}`}>
      {children}
    </div>
  );
}

const ColumarStyled = React.memo(styled(Columar)`
  &.isPadded .ui--Column {
    padding: 0 0.75rem;
  }

  @media (min-width: ${MAX_WIDTH}) {
    display: flex;
    flex-wrap: wrap;

    &.is50 {
      .ui--Column {
        max-width: 50%;
        min-width: 50%;
      }
    }

    &.is60 {
      .ui--Column:first-child {
        max-width: 60%;
        min-width: 60%;
      }

      .ui--Column:last-child {
        max-width: 40%;
        min-width: 40%;
      }
    }

    &.Full {
      .ui--Column {
        max-width: 100%;
        min-width: 100%;
      }
    }
  }
`) as unknown as ColumarType;

ColumarStyled.Column = React.memo(styled(Column)`
  box-sizing: border-box;
  max-width: 100%;
  flex: 1 1;
  margin: 0;
  width: 100%;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
`);

export default ColumarStyled;
