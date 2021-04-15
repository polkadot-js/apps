// Copyright 2017-2021 @polkadot/react-params authors & contributors
// and @canvas-ui/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Static } from '@canvas-ui/react-components';
import { Props, RawParamOnChangeValue } from '@canvas-ui/react-components/types';
import React, { useCallback } from 'react';

import Amount from './Amount';

function Moment ({ className = '', defaultValue, isDisabled, isError, label, onChange, onEnter, onEscape, type, withLabel }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    (value: RawParamOnChangeValue) =>
      onChange && onChange(value),
    [onChange]
  );

  if (isDisabled) {
    return (
      <Static
        className={className}
        defaultValue={
          (defaultValue && defaultValue.value)
            ? (defaultValue.value as string).toString()
            : ''
        }
        isError={isError}
        label={label}
        withLabel={withLabel}
      />
    );
  }

  return (
    <Amount
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      onChange={_onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      type={type}
      withLabel={withLabel}
    />
  );
}

export default React.memo(Moment);
