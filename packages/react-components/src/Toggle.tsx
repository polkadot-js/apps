// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from './types';

import React, { useCallback } from 'react';
import SUICheckbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import styled from 'styled-components';

interface Props extends BareProps {
  asSwitch?: boolean;
  defaultValue?: boolean;
  isDisabled?: boolean;
  label: React.ReactNode;
  onChange?: (isChecked: boolean) => void;
  preventDefault?: boolean;
  value?: boolean;
}

function Toggle ({ asSwitch = true, className = '', defaultValue, isDisabled, label, onChange, preventDefault, value }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>, { checked }: any): void => {
      if (preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }

      onChange && onChange(checked);
    },
    [onChange, preventDefault]
  );

  return (
    <div className={`ui--Toggle ${asSwitch ? 'isToggle' : 'isCheckbox'} ${className}`}>
      <SUICheckbox
        checked={value}
        defaultChecked={defaultValue}
        disabled={isDisabled}
        onChange={_onChange}
        toggle={asSwitch}
      />
      <label>{label}</label>
    </div>
  );
}

export default React.memo(styled(Toggle)`
  display: flex;
  align-items: center;

  > label {
    color: var(--grey50);
    margin: 0 0 0 0.5rem;
  }

  &.isCheckbox label {
    opacity: 1 !important;
  }
`);
