// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ButtonProps as Props } from './types.js';

import React, { useCallback, useEffect } from 'react';

import Icon from '../Icon.js';
import Spinner from '../Spinner.js';
import { styled } from '../styled.js';
import Group from './Group.js';

function ButtonBase ({ activeOnEnter, children, className = '', dataTestId = '', icon, isBasic, isBusy, isCircular, isDisabled, isFull, isIcon, isSelected, isToplevel, label, onClick, isReadOnly = !onClick, onMouseEnter, onMouseLeave, tabIndex, withoutLink }: Props): React.ReactElement<Props> {
  const _onClick = useCallback(
    (): void => {
      !(isBusy || isDisabled) && onClick && Promise
        .resolve(onClick())
        .catch(console.error);
    },
    [isBusy, isDisabled, onClick]
  );

  const _onMouseEnter = useCallback((): void => {
    onMouseEnter && Promise
      .resolve(onMouseEnter())
      .catch(console.error);
  }, [onMouseEnter]);

  const _onMouseLeave = useCallback((): void => {
    onMouseLeave && Promise
      .resolve(onMouseLeave())
      .catch(console.error);
  }, [onMouseLeave]);

  const listenKeyboard = useCallback((event: KeyboardEvent): void => {
    if (!isBusy && !isDisabled && event.key === 'Enter') {
      onClick && Promise
        .resolve(onClick())
        .catch(console.error);
    }
  }, [isBusy, isDisabled, onClick]);

  useEffect(() => {
    if (activeOnEnter) {
      window.addEventListener('keydown', listenKeyboard, true);
    }

    return () => {
      if (activeOnEnter) {
        window.removeEventListener('keydown', listenKeyboard, true);
      }
    };
  }, [activeOnEnter, listenKeyboard]);

  return (
    <StyledButton
      className={`${className} ui--Button ${label ? 'hasLabel' : ''} ${isBasic ? 'isBasic' : ''} ${isCircular ? 'isCircular' : ''} ${isFull ? 'isFull' : ''} ${isIcon ? 'isIcon' : ''} ${(isBusy || isDisabled) ? 'isDisabled' : ''} ${isBusy ? 'isBusy' : ''} ${isReadOnly ? 'isReadOnly' : ''}${isSelected ? 'isSelected' : ''} ${isToplevel ? 'isToplevel' : ''} ${withoutLink ? 'withoutLink' : ''}`}
      data-testid={dataTestId}
      onClick={_onClick}
      onMouseEnter={_onMouseEnter}
      onMouseLeave={_onMouseLeave}
      tabIndex={tabIndex}
    >
      {icon && <Icon icon={icon} />}
      {label}
      {children}
      {isBusy && (
        <Spinner
          className='ui--Button-spinner'
          variant='cover'
        />
      )}
    </StyledButton>
  );
}

const ICON_PADDING = 0.5;

const StyledButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  line-height: 1;
  margin: 0;
  outline: none;
  position: relative;
  vertical-align: middle;
  text-align: center;

  &:not(.hasLabel) {
    padding: 0.7em;

    .ui--Icon {
      padding: 0.6rem;
      margin: -0.6rem;
    }
  }

  &:not(.isCircular) {
    border-radius: 0.25rem;
  }

  &:focus {
    outline:0;
  }

  &.hasLabel {
    padding: 0.7rem 1.1rem 0.7rem ${1.1 - ICON_PADDING}rem;

    .ui--Icon {
      margin-right: 0.425rem !important;
    }
  }

  &.isBasic {
    background: var(--bg-table);
  }

  &.isCircular {
    border-radius: 10rem;
  }

  &.isDisabled, &.isReadOnly {
    background: none;
    box-shadow: none;
    cursor: not-allowed;
  }

  &.isBusy {
    cursor: wait;
  }

  &.isFull {
    display: block;
    width: 100%;
  }

  &.isIcon {
    background: transparent;
  }

  .ui--Button-overlay {
    background: rgba(253, 252, 251, 0.75);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    visibility: hidden;
  }

  .ui--Icon {
    border-radius: 50%;
    box-sizing: content-box;
    height: 1rem;
    margin: -${ICON_PADDING}rem 0;
    padding: ${ICON_PADDING}rem;
    width: 1rem;
  }

  &.isDisabled {
    color: #bcbbba;
  }
`;

const Button = React.memo(ButtonBase) as unknown as typeof ButtonBase & {
  Group: typeof Group
};

Button.Group = Group;

export default Button;
