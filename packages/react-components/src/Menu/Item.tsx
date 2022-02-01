// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ItemProps } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import Icon from '../Icon';

function Item ({ children, className = '', icon, isDisabled, onClick }: ItemProps): React.ReactElement<ItemProps> {
  const _onClick = useCallback(
    () => !isDisabled && onClick && onClick(),
    [isDisabled, onClick]
  );

  return (
    <div
      className={`ui--Menu__Item ${className}${icon ? ' hasIcon' : ''}${isDisabled ? ' isDisabled' : ''}`}
      onClick={_onClick}
    >
      {icon && (
        <Icon
          color='darkGray'
          icon={icon}
        />
      )}
      {children}
    </div>
  );
}

export default React.memo(styled(Item)`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;

  position: relative;

  font-size: 0.93rem;
  line-height: 0.93rem;

  padding: 0.5rem 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  &.hasIcon {
    padding-left: 2.6rem;
  }

  .ui--Icon {
    position: absolute;
    left: 1rem;
  }

  &.isDisabled {
    cursor: default;
    opacity: 0.5;
  }
`);
