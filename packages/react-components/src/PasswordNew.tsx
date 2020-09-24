// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import InputNew from './InputNew';

interface Props {
  autoFocus?: boolean;
  children?: React.ReactNode;
  className?: string;
  defaultValue?: string;
  help?: string;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  label?: string;
  labelExtra?: React.ReactNode;
  name?: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  onEscape?: () => void;
  tabIndex?: number;
  value: string;
  withLabel?: boolean;
}

function PasswordNew ({ autoFocus, children, className = '', defaultValue, help, isDisabled, isError, isFull, label, labelExtra, name, onChange, onEnter, onEscape, tabIndex, value, withLabel }: Props): React.ReactElement<Props> {
  return (
    <InputNew
      autoFocus={autoFocus}
      className={`ui--Password ${className}`}
      defaultValue={defaultValue}
      help={help}
      isDisabled={isDisabled}
      isError={isError}
      isFull={isFull}
      label={label}
      labelExtra={labelExtra}
      name={name}
      onChange={onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      tabIndex={tabIndex}
      type='password'
      value={value}
      withLabel={withLabel}
    >
      {children}
    </InputNew>
  );
}

export default React.memo(PasswordNew);
