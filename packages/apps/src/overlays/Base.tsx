// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ThemeProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Button, Icon } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
  children: React.ReactNode;
  className?: string;
  icon: IconName;
  type: 'error' | 'info';
}

function BaseOverlay ({ children, className = '', icon, type }: Props): React.ReactElement<Props> | null {
  const [isHidden, toggleHidden] = useToggle();

  if (isHidden) {
    return null;
  }

  return (
    <div className={`${className} ${type === 'error' ? 'isError' : 'isInfo'}`}>
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
    </div>
  );
}

export default React.memo(styled(BaseOverlay)(({ theme }: ThemeProps) => `
  background: ${theme.bgMenu};
  border: 1px solid transparent;
  border-radius: 0.25rem;
  border-left-width: 0.25rem;
  line-height: 1.5em;
  padding: 0 1rem;
  position: fixed;
  right: 0.75rem;
  top: 0.75rem;
  max-width: 55rem;
  z-index: 500;

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
    display: flex;
    margin: 0 auto;
    max-width: 50rem;
    padding: 1em;
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
`));
