// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Icon } from '@polkadot/react-components';
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
        <Icon
          className='closeIcon'
          icon='times'
          onClick={toggleHidden}
        />
      </div>
    </div>
  );
}

export default React.memo(styled(BaseOverlay)`
  border-bottom: 1px solid transparent;
  left: 0;
  line-height: 1.5em;
  padding: 0 2rem;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 500;

  &.isError {
    background: #ffe6e6;
    border-color: #c00;
    color: #4d0000;
  }

  &.isInfo {
    background: #fff6cb;
    border-color: #e7c000;
    color: #6b5900;
  }

  .content {
    display: flex;
    margin: 0 auto;
    max-width: 50rem;
    padding: 1em 2rem;
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
    right: 0.75em;
    top: 0.75em;
  }
`);
