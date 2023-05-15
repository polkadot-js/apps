// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React from 'react';

import { Button, Icon, styled } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
  children: React.ReactNode;
  className?: string;
  icon: IconName;
  isBottom?: boolean;
  isFull?: boolean;
  type: 'error' | 'info';
}

function BaseOverlay ({ children, className = '', icon, isBottom = false, isFull = false, type }: Props): React.ReactElement<Props> | null {
  const [isHidden, toggleHidden] = useToggle();

  if (isHidden) {
    return null;
  }

  return (
    <StyledDiv className={`${className} ${type === 'error' ? 'isError' : 'isInfo'} ${isBottom ? 'isBottom' : 'isTop'} ${isFull ? 'isFull' : 'isPartial'}`}>
      <div className='content'>
        <Icon
          className='contentIcon'
          icon={icon}
          size='2x'
        />
        <div className='contentItem'>
          {children}
        </div>
        <Button
          className='closeIcon'
          icon='times'
          isBasic
          isCircular
          onClick={toggleHidden}
        />
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  background: var(--bg-menu);
  border: 1px solid transparent;
  border-radius: 0.25rem;
  border-left-width: 0.25rem;
  line-height: 1.5em;
  padding: 0 1rem;
  position: fixed;
  right: 0.75rem;
  top: 0.75rem;
  z-index: 500;

  &.isBottom {
    bottom: 0.75rem;
    top: auto;
  }

  &.isFull {
    left: 0.75rem;
  }

  &.isPartial {
    max-width: 42rem;
    width: 42rem;

    .content {
      max-width: 50rem;
    }
  }

  &:before {
    border-radius: 0.25rem;
    bottom: 0;
    content: ' ';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }

  &.isError {
    &:before {
      background: rgba(255, 12, 12, 0.05);
    }

    border-color: rgba(255, 12, 12, 1);
  }

  &.isInfo {
    &:before {
      background: rgba(255, 196, 12, 0.05);
    }

    border-color: rgba(255, 196, 12, 1);
  }

  .content {
    align-items: center;
    display: flex;
    margin: 0 auto;
    padding: 1em 3rem 1rem 0.5rem;
    position: relative;

    .contentIcon {
      flex: 0;
    }

    .contentItem {
      flex: 1;
      padding: 0 1rem;

      > div+div {
        margin-top: 0.5rem;
      }
    }
  }

  .closeIcon {
    cursor: pointer;
    position: absolute;
    right: 0em;
    top: 0.75rem;
  }
`;

export default React.memo(BaseOverlay);
