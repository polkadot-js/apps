// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  className?: string;
  is60?: boolean;
  is100?: boolean;
  isPadded?: boolean;
}

interface ColumnProps {
  children: React.ReactNode;
  className?: string;
}

type ColumarType = React.ComponentType<Props> & {
  Column: React.ComponentType<ColumnProps>;
};

function Column ({ children, className = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Column ${className}`}>
      {children}
    </div>
  );
}

function Columar ({ children, className = '', is60, is100, isPadded = true }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Columar ${is100 ? 'is100' : (is60 ? 'is60' : 'is50')} ${isPadded ? 'isPadded' : ''} ${className}`}>
      {children}
    </div>
  );
}

const ColumarStyled = React.memo(styled(Columar)`
  &.isPadded > .ui--Column {
    padding: 0 0.75rem;
  }

  > .ui--Column {
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
  }

  @media (min-width: 1025px) {
    display: flex;
    flex-wrap: wrap;

    &.is50 {
      > .ui--Column {
        max-width: 50%;
        min-width: 50%;
      }
    }

    &.is60 {
      > .ui--Column:first-child {
        max-width: 60%;
        min-width: 60%;
      }

      > .ui--Column:last-child {
        max-width: 40%;
        min-width: 40%;
      }
    }

    &.is100 {
      > .ui--Column {
        max-width: 100%;
        min-width: 100%;
      }
    }
  }
`) as unknown as ColumarType;

ColumarStyled.Column = Column;

export default ColumarStyled;
