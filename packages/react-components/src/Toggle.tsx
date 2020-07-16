// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  isDisabled?: boolean;
  label: React.ReactNode;
  onChange?: (isChecked: boolean) => void;
  preventDefault?: boolean;
  value?: boolean;
}

function Toggle ({ className = '', isDisabled, label, onChange, preventDefault, value }: Props): React.ReactElement<Props> {
  const _onClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
      if (!isDisabled) {
        if (preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }

        onChange && onChange(!value);
      }
    },
    [isDisabled, onChange, preventDefault, value]
  );

  return (
    <div
      className={`ui--Toggle${value ? ' isChecked' : ''}${isDisabled ? ' isDisabled' : ''} ${className}`}
      onClick={_onClick}
    >
      {label && <label>{label}</label>}
      <div className='ui--Toggle-Slider' />
    </div>
  );
}

export default React.memo(styled(Toggle)`
  > label {
    color: rgba(78, 78, 78, 0.75);
    display: inline-block;
    margin: 0 0.5rem;
  }

  > label,
  > div {
    vertical-align: middle;
  }

  .ui--Toggle-Slider {
    background: #e4e5e6;
    border-radius: 1.5rem;
    display: inline-block;
    height: 1.5rem;
    position: relative;
    width: 3rem;

    &::before {
      background: white;
      border: 0.125rem solid #e4e5e6;
      border-radius: 50%;
      content: "";
      height: 1.5rem;
      left: 0;
      position: absolute;
      top: 0rem;
      width: 1.5rem;
    }
  }

  &:not(.isDisabled) {
    cursor: pointer;
  }

  &.isChecked {
    .ui--Toggle-Slider {
      background: #2196F3;

      &:before {
        border-color: #2196F3;
        transform: translateX(1.5rem);
      }
    }
  }
`);
