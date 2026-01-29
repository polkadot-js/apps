// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ItemProps } from './types.js';

import React, { useCallback } from 'react';

import Icon from '../Icon.js';
import { styled } from '../styled.js';

function Item ({ children, className = '', icon, isDisabled, label, onClick }: ItemProps): React.ReactElement<ItemProps> {
  const _onClick = useCallback(
    (): void => {
      !isDisabled && onClick && Promise
        .resolve(onClick())
        .catch(console.error);
    },
    [isDisabled, onClick]
  );

  return (
    <StyledDiv
      className={`${className} ui--Menu__Item ${icon ? 'hasIcon' : ''} ${isDisabled ? 'isDisabled' : ''}`}
      onClick={_onClick}
    >
      {icon && (
        <Icon
          color='darkGray'
          icon={icon}
        />
      )}
      {label}{children}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  font-size: var(--font-size-small);
  line-height: 0.93rem;
  padding: 0.5rem 1rem;
  position: relative;

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
`;

export default React.memo(Item);
