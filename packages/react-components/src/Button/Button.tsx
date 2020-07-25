// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ButtonProps } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import Icon from '../Icon';
import Spinner from '../Spinner';

// iBasic, isPrimary, isPosition, isNegative - here for old compat, check, remove
function Button ({ children, className = '', icon, isBasic, isBusy, isCircular, isDisabled, isFull, isIcon, isNegative, isPositive, isPrimary, label, onClick, onMouseEnter, onMouseLeave, tabIndex }: ButtonProps): React.ReactElement<ButtonProps> {
  const _onClick = useCallback(
    () => !(isBusy || isDisabled) && onClick && onClick(),
    [isBusy, isDisabled, onClick]
  );

  return (
    <button
      className={`ui--Button${label ? ' hasLabel' : ''}${isBasic ? ' isBasic' : ''}${isCircular ? ' isCircular' : ''}${isFull ? ' isFull' : ''}${isIcon ? ' isIcon' : ''}${isNegative ? ' isNegative' : ''}${isPositive ? ' isPositive' : ''}${isPrimary ? ' isPrimary' : ''}${(isBusy || isDisabled) ? ' isDisabled' : ''}${isBusy ? ' isBusy' : ''}${!onClick ? ' isReadOnly' : ''} ${className}`}
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
  background: #e9e8e7; // similar to rgba(0, 0, 0, 0.05);
  border: none;
  color: #4e4e4e;
  cursor: pointer;
  // font-size: 0.92857142857rem; // 13/14px
  margin: 0 1px;
  position: relative;
  text-align: center;
  // text-shadow: 0 0 2px #f5f4f3;

  &:not(.hasLabel) {
    padding: 0.7em;

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
    padding: 0.7em 1.3em;

    > .ui--Icon {
      margin-right: 0.75rem;
    }
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
    background: rgba(245, 244, 243, 0.75);
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

  &.isDisabled {
    .ui--Button-overlay {
      visibility: visible;
    }
  }
`);
