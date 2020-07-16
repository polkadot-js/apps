// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
    <div className={`ui--Checkbox${isDisabled ? ' isDisabled' : ''} ${className}`}>
      <Icon
        color={value ? 'normal' : 'transparent'}
        icon='check'
        onClick={_onClick}
      />
      {label && <label>{label}</label>}
    </div>
  );
}

export default React.memo(styled(Checkbox)`
  &.isDisabled {
    opacity: 0.5;
  }

  &:not(.isDisabled) {
    cursor: pointer;
  }

  > label {
    color: rgba(78, 78, 78, 0.75);
    display: inline-block;
    margin: 0 0.5rem;
    opacity: 1;
  }

  > label,
  > .ui--Icon {
    vertical-align: middle;
  }

  .ui--Icon {
    border: 1px solid rgba(34, 36, 38, 0.15);
    border-radius: 0.125rem;
  }
`);
