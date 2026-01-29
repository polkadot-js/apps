// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Input from './Input.js';

interface Props {
  autoFocus?: boolean;
  children?: React.ReactNode;
  className?: string;
  defaultValue?: string;
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

function Password ({ autoFocus, children, className = '', defaultValue, isDisabled, isError, isFull, label, labelExtra, name, onChange, onEnter, onEscape, tabIndex, value, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Input
      autoFocus={autoFocus}
      className={`${className} ui--Password`}
      defaultValue={defaultValue}
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
    </Input>
  );
}

export default React.memo(Password);
