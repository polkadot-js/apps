// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props, RawParamOnChangeValue } from '../types';

import React from 'react';
import { Static } from '@polkadot/react-components';

import Amount from './Amount';

function renderDisabled ({ className, defaultValue, isError, label, style, withLabel }: Props): React.ReactNode {
  return (
    <Static
      className={className}
      defaultValue={
        (defaultValue && defaultValue.value)
          ? defaultValue.value.toString()
          : ''
      }
      isError={isError}
      label={label}
      style={style}
      withLabel={withLabel}
    />
  );
}

// TODO: Validate that we have actual proper WASM code
function onChange ({ onChange }: Props): (_: RawParamOnChangeValue) => void {
  return function (value: RawParamOnChangeValue): void {
    onChange && onChange(value);
  };
}

export default function Code (props: Props): React.ReactNode {
  const { className, defaultValue, isDisabled, isError, label, onEnter, style, type, withLabel } = props;

  if (isDisabled) {
    return (
      <>
        {renderDisabled(props)}
      </>
    );
  }

  return (
    <Amount
      className={className}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      onChange={onChange(props)}
      onEnter={onEnter}
      style={style}
      type={type}
      withLabel={withLabel}
    />
  );
}
