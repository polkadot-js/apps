// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';
import type { ButtonProps } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import Icon from '../Icon';
import Spinner from '../Spinner';

function Button ({ children, className = '', icon, isBasic, isBusy, isCircular, isDisabled, isFull, isIcon, isNegative, isPrimary, isSelected, isToplevel, label, onClick, onMouseEnter, onMouseLeave, tabIndex, withoutLink }: ButtonProps): React.ReactElement<ButtonProps> {
  const _onClick = useCallback(
    () => !(isBusy || isDisabled) && onClick && onClick(),
    [isBusy, isDisabled, onClick]
  );

  return (
    <button
      className={`ui--Button${label ? ' hasLabel' : ''}${isBasic ? ' isBasic' : ''}${isCircular ? ' isCircular' : ''}${isFull ? ' isFull' : ''}${isIcon ? ' isIcon' : ''}${(isBusy || isDisabled) ? ' isDisabled' : ''}${isBusy ? ' isBusy' : ''}${isNegative ? ' isNegative' : ''}${isPrimary ? ' isPrimary' : ''}${isSelected ? ' isSelected' : ''}${isToplevel ? ' isToplevel' : ''}${withoutLink ? ' withoutLink' : ''} ${className}`}
      onClick={_onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={tabIndex}
    >
      {icon && <Icon icon={icon} />}
      {label}
      {children}
      <Spinner
        className='ui--Button-spinner'
        variant='cover'
      />
    </button>
  );
}

const ICON_PADDING = 0.5;

export default React.memo(styled(Button)(({ theme }: ThemeProps) => `
  background: transparent;
  border-color: var(--grey30);
  border-width: 2px;
  border-style: solid;
  color: var(--grey80);
  cursor: pointer;
  line-height: 1;
  margin: 0;
  position: relative;
  vertical-align: middle;
  text-align: center;

  &:focus,
  &:hover {
    border-color: var(--blue-secondary);
  }

  &:not(.hasLabel) {
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
    padding: 0.6rem 1.1rem;

    .ui--Icon {
      margin-right: 0.425rem !important;
    }
  }

  &.isBasic {
    background: ${theme.bgTable};
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
    border-color: transparent;
    color: var(--blue-primary);
  }

  &.isNegative {
    &:active,
    &:active,
    &:focus,
    &:hover {
      border-color: var(--red-primary);
    }
  }

  &.isPrimary {
    background-color: var(--blue-primary);
    border-color: var(--blue-primary);

    &:focus,
    &:hover {
      background-color: var(--blue-secondary);
      border-color: var(--blue-secondary);
    }
  }

  .ui--Button-spinner {
    visibility: hidden;
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

  &.isBusy {
    .ui--Button-spinner {
      visibility: visible;
    }
  }

  &.isDisabled {
    color: #bcbbba;
  }
`));
