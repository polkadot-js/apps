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
  isPaddedSmall?: boolean;
}

interface ColumnProps {
  children: React.ReactNode;
  className?: string;
}

type ColumarType = React.ComponentType<Props> & {
  Column: React.ComponentType<ColumnProps>;
};

const MIN_WIDTH = '1200px';

function Column ({ children, className = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Column ${className}`}>
      {children}
    </div>
  );
}

function Columar ({ children, className = '', is60, isFull, isPadded = true, isPaddedSmall }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Columar ${isFull ? 'isFull' : (is60 ? 'is60' : 'is50')} ${isPaddedSmall ? 'isPaddedSmall' : (isPadded ? 'isPadded' : '')} ${className}`}>
      {children}
    </div>
  );
}

const ColumarStyled = React.memo(styled(Columar)`
  display: flex;
  flex-wrap: wrap;

  &.is50 {
    .ui--Column {
      @media (min-width: ${MIN_WIDTH}) {
        max-width: 50%;
        min-width: 50%;
        width: 50%;
      }
    }
  }

  &.is60 {
    .ui--Column:first-child {
      @media (min-width: ${MIN_WIDTH}) {
        max-width: 60%;
        min-width: 60%;
        width: 60%;
      }
    }

    .ui--Column:last-child {
      @media (min-width: ${MIN_WIDTH}) {
        max-width: 40%;
        min-width: 40%;
        width: 40%;
      }
    }
  }

  &.isFull {
    .ui--Column {
      @media (min-width: ${MIN_WIDTH}) {
        max-width: 100%;
        min-width: 100%;
        width: 100%;
      }
    }
  }

  &.isPadded .ui--Column {
    @media (min-width: ${MIN_WIDTH}) {
      padding: 0 0.75rem;
    }
  }

  &.isPaddedSmall .ui--Column {
    @media (min-width: ${MIN_WIDTH}) {
      padding: 0 0.125rem;
    }

    &:last-child {
      table thead {
        display: none;

        @media (min-width: ${MIN_WIDTH}) {
          display: table-header-group;
          visibility: hidden;
        }
      }
    }
  }

  .ui--Column {
    box-sizing: border-box;
    flex: 0 0;
    max-width: 100%;
    min-width: 100%;
    margin: 0;
    width: 100%;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }
  }
`) as unknown as ColumarType;

ColumarStyled.Column = React.memo(Column);

export default ColumarStyled;
