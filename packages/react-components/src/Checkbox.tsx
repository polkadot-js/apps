// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import Icon from './Icon.js';
import { styled } from './styled.js';

interface Props {
  className?: string;
  isDisabled?: boolean;
  label?: React.ReactNode;
  onChange?: (isChecked: boolean) => void;
  value?: boolean;
}

function Checkbox ({ className = '', isDisabled, label, onChange, value }: Props): React.ReactElement<Props> {
  const _onClick = useCallback(
    (): void => {
      !isDisabled && onChange && onChange(!value);
    },
    [isDisabled, onChange, value]
  );

  return (
    <StyledDiv
      className={`${className} ui--Checkbox ${isDisabled ? 'isDisabled' : ''}`}
      onClick={_onClick}
    >
      <Icon
        color={value ? 'normal' : 'transparent'}
        icon='check'
      />
      {label && <label>{label}</label>}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  display: inline-block;
  cursor: pointer;

  &.isDisabled {
    opacity: 0.5;
  }

  &:not(.isDisabled) {
    cursor: pointer;
  }

  > label {
    color: var(--color-text);
    display: inline-block;
    margin: 0 0.5rem;
    opacity: 1;
    cursor: pointer;
    user-select: none;
  }

  > label,
  > .ui--Icon {
    vertical-align: middle;
  }

  .ui--Icon {
    border: 1px solid var(--color-checkbox);
    border-radius: 0.125rem;
  }
`;

export default React.memo(Checkbox);
