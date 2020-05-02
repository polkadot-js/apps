// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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

function Toggle ({ asSwitch = true, className, defaultValue, isDisabled, label, onChange, preventDefault, value }: Props): React.ReactElement<Props> {
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
      <label>{label}</label>
      <SUICheckbox
        checked={value}
        defaultChecked={defaultValue}
        disabled={isDisabled}
        onChange={_onChange}
        toggle={asSwitch}
      />
    </div>
  );
}

export default React.memo(styled(Toggle)`
  > label {
    display: inline-block;
    margin: 0 0.5rem;
  }

  > label,
  > .ui.checkbox {
    vertical-align: middle;
  }

  .ui.checkbox + label {
    color: rgba(78, 78, 78, 0.75);
  }

  &.isCheckbox label {
    opacity: 1 !important;
  }
`);
