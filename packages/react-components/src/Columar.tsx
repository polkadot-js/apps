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
  isReverse?: boolean;
  size?: 'default' | 'small' | 'tiny';
}

interface ColumnProps {
  children: React.ReactNode;
  className?: string;
}

type ColumarType = React.ComponentType<Props> & {
  Column: React.ComponentType<ColumnProps>;
};

const MIN_WIDTH_DEFAULT = '1025px';
const MIN_WIDTH_SMALL = '750px';
const MIN_WIDTH_TINY = '550px';

const FLEX_OPTIONS = `
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
`;

function Column ({ children, className = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Column ${className}`}>
      {children}
    </div>
  );
}

function Columar ({ children, className = '', is60, is100, isPadded = true, isReverse, size = 'default' }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Columar ${is100 ? 'is100' : (is60 ? 'is60' : 'is50')} ${isPadded ? 'isPadded' : ''} ${isReverse ? 'isReverse' : ''} ${size}Size ${className}`}>
      {children}
    </div>
  );
}

const ColumarStyled = React.memo(styled(Columar)`
  &.isPadded {
    &.defaultSize {
      > .ui--Column {
        padding: 0 0.75rem;
      }
    }

    &.smallSize {
      > .ui--Column {
        padding: 0 0.50rem;
      }
    }

    &.tinySize {
      > .ui--Column {
        padding: 0 0.25rem;
      }
    }
  }

  &.isReverse {
    flex-direction: row-reverse;
  }

  &.defaultSize {
    @media (min-width: ${MIN_WIDTH_DEFAULT}) {
      ${FLEX_OPTIONS}
    }
  }

  &.smallSize {
    @media (min-width: ${MIN_WIDTH_SMALL}) {
      ${FLEX_OPTIONS}
    }
  }

  &.tinySize {
    @media (min-width: ${MIN_WIDTH_TINY}) {
      ${FLEX_OPTIONS}
    }
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
`) as unknown as ColumarType;

ColumarStyled.Column = Column;

export default ColumarStyled;
