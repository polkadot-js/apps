// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ButtonProps } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import Icon from '../Icon';
import Spinner from '../Spinner';

function Button ({ children, className = '', dataTestId = '', icon, isBasic, isBusy, isCircular, isDisabled, isFull, isIcon, isSelected, isToplevel, label, onClick, onMouseEnter, onMouseLeave, tabIndex, withoutLink }: ButtonProps): React.ReactElement<ButtonProps> {
  const _onClick = useCallback(
    () => !(isBusy || isDisabled) && onClick && onClick(),
    [isBusy, isDisabled, onClick]
  );

  return (
    <button
      className={`ui--Button${label ? ' hasLabel' : ''}${isBasic ? ' isBasic' : ''}${isCircular ? ' isCircular' : ''}${isFull ? ' isFull' : ''}${isIcon ? ' isIcon' : ''}${(isBusy || isDisabled) ? ' isDisabled' : ''}${isBusy ? ' isBusy' : ''}${!onClick ? ' isReadOnly' : ''}${isSelected ? ' isSelected' : ''}${isToplevel ? ' isToplevel' : ''}${withoutLink ? ' withoutLink' : ''} ${className}`}
      data-testid={dataTestId}
      onClick={_onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={tabIndex}
    >
      <Icon icon={icon} />
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

export default React.memo(styled(Button)`
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
`);
