// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ButtonProps } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import Icon from '../Icon';
import Spinner from '../Spinner';

function Button ({ children, className = '', icon, isBasic, isBusy, isCircular, isDisabled, isFull, isIcon, isNegative, isPositive, isPrimary, label, onClick, onMouseEnter, onMouseLeave, tabIndex }: ButtonProps): React.ReactElement<ButtonProps> {
  const _onClick = useCallback(
    () => !(isBusy || isDisabled) && onClick && onClick(),
    [isBusy, isDisabled, onClick]
  );

  return (
    <button
      className={`ui--Button${label ? ' hasLabel' : ''}${isBasic ? ' isBasic' : ''}${isCircular ? ' isCircular' : ''}${isFull ? ' isFull' : ''}${isIcon ? ' isIcon' : ''}${isNegative ? ' isNegative' : ''}${isPositive ? ' isPositive' : ''}${isPrimary ? (isBasic ? ' ui--highlight--border' : ' ui--highlight--button') : ''}${isDisabled ? ' isDisabled' : ''}${isBusy ? ' isBusy' : ''} ${className}`}
      onClick={_onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={tabIndex}
    >
      <Icon icon={icon} />
      {label}
      {children}
      <div className='ui--Button-overlay'>
        <Spinner
          className='ui--Button-spinner'
          variant='cover'
        />
      </div>
    </button>
  );
}

export default React.memo(styled(Button)`
  border: none;
  cursor: pointer;
  font-size: 0.92857142857rem; // 13/14px
  position: relative;
  text-align: center;

  &:not(.hasLabel) {
    padding: 0.75em;

    > .ui--Icon {
      height: 1rem;
      width: 1rem;
    }
  }

  &:not(.isCircular) {
    border-radius: 0.25rem;
  }

  &:focus {
    outline:0;
  }

  &.hasLabel {
    padding: 0.75em 1.5em;

    > .ui--Icon {
      margin-right: 0.75rem;
    }
  }

  &.isBasic {
    background: white !important;
    box-shadow: 0 0 0 1px #ddd;
    color: inherit !important;
  }

  &.isBusy {
    cursor: wait;
  }

  &.isCircular {
    border-radius: 10rem;
  }

  &.isDisabled {
    cursor: not-allowed;
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
    background: rgba(255, 255, 255, 0.75);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    visibility: hidden;
  }

  &.isBusy {
    .ui--Button-spinner {
      visibility: visible;
    }
  }

  &.isBusy,
  &.isDisabled {
    .ui--Button-overlay {
      visibility: visible;
    }
  }
`);
