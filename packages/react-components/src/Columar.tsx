// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from './styled.js';

interface Props {
  children: React.ReactNode;
  className?: string;
  is60?: boolean;
  is100?: boolean;
  isPadded?: boolean;
  isReverse?: boolean;
  size?: 'default' | 'small' | 'tiny';
}

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
    <div className={`${className} ui--Column`}>
      {children}
    </div>
  );
}

function ColumarBase ({ children, className = '', is60, is100, isPadded = true, isReverse, size = 'default' }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={`${className} ui--Columar ${is100 ? 'is100' : (is60 ? 'is60' : 'is50')} ${isPadded ? 'isPadded' : ''} ${isReverse ? 'isReverse' : ''} ${size}Size`}>
      {children}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  &.isReverse {
    flex-direction: row-reverse;
  }

  &.defaultSize {
    @media only screen and (min-width: ${MIN_WIDTH_DEFAULT}) {
      ${FLEX_OPTIONS}
    }

    &.isPadded > .ui--Column {
      padding: 0 0.75rem;
    }
  }

  &.smallSize {
    @media only screen and (min-width: ${MIN_WIDTH_SMALL}) {
      ${FLEX_OPTIONS}
    }

    &isPadded > .ui--Column {
      padding: 0 0.5rem;
    }
  }

  &.tinySize {
    @media only screen and (min-width: ${MIN_WIDTH_TINY}) {
      ${FLEX_OPTIONS}
    }

    &.isPadded > .ui--Column {
      padding: 0 0.25rem;
    }
  }

  &.defaultSize, &.smallSize {
    @media only screen and (max-width: ${MIN_WIDTH_SMALL}) {
      &.isPadded > .ui--Column {
        padding: 0 0.5rem;
      }
    }
  }

  &.defaultSize, &.smallSize, &.tinySize {
    @media only screen and (max-width: ${MIN_WIDTH_TINY}) {
      &.isPadded > .ui--Column {
        padding: 0 0.25rem;
      }
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
`;

const Columar = React.memo(ColumarBase) as unknown as typeof ColumarBase & {
  Column: typeof Column
};

Columar.Column = Column;

export default Columar;
