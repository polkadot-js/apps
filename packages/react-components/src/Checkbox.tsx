// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import Icon from './Icon';

interface Props {
  className?: string;
  isDisabled?: boolean;
  label: React.ReactNode;
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
    <div
      className={`ui--Checkbox${isDisabled ? ' isDisabled' : ''} ${className}`}
      onClick={_onClick}
    >
      <Icon
        color={value ? 'normal' : 'transparent'}
        icon='check'
      />
      {label && <label>{label}</label>}
    </div>
  );
}

export default React.memo(styled(Checkbox)(({ theme }: ThemeProps) => `
  display: inline-block;
  cursor: pointer;

  &.isDisabled {
    opacity: 0.5;
  }

  &:not(.isDisabled) {
    cursor: pointer;
  }

  > label {
    color: ${theme.color};
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
    border: 1px solid ${theme.colorCheckbox};
    border-radius: 0.125rem;
  }
`));
