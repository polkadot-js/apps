// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import { styled } from './styled.js';

interface Props {
  className?: string;
  isDisabled?: boolean;
  isRadio?: boolean;
  label: React.ReactNode;
  onChange?: (isChecked: boolean) => void;
  preventDefault?: boolean;
  value?: boolean;
}

function Toggle ({ className = '', isDisabled, isRadio, label, onChange, preventDefault, value }: Props): React.ReactElement<Props> {
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
    <StyledDiv
      className={`${className} ui--Toggle ${value ? 'isChecked' : ''} ${isDisabled ? 'isDisabled' : ''} ${isRadio ? 'isRadio' : ''}`}
      onClick={_onClick}
    >
      {label && <label>{label}</label>}
      <div className={`ui--Toggle-Slider ${isRadio ? 'highlight--before-border' : ''}`} />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  > label {
    display: inline-block;
    margin: 0 0.5rem !important;
  }

  > label,
  > div {
    vertical-align: middle;
  }

  .ui--Toggle-Slider {
    background: var(--bg-toggle);
    border-radius: 1.5rem;
    display: inline-block;
    height: 1.5rem;
    position: relative;
    width: 3rem;

    &::before {
      background: var(--bg-table);
      border: 0.125rem solid var(--bg-toggle);
      border-radius: 50%;
      content: "";
      height: 1.5rem;
      left: 0;
      position: absolute;
      top: 0;
      width: 1.5rem;
    }
  }

  &:not(.isDisabled) {
    cursor: pointer;

    > label {
      cursor: pointer;
    }
  }

  &.isChecked {
    &:not(.isRadio) {
      .ui--Toggle-Slider:before {
        transform: translateX(1.5rem);
      }
    }

    &.isRadio {
      .ui--Toggle-Slider:before {
        border-width: 0.5rem;
      }
    }
  }

  &.isRadio {
    .ui--Toggle-Slider {
      width: 1.5rem;
    }
  }
`;

export default React.memo(Toggle);
