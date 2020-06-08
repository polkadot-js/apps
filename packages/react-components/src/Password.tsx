// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { MAX_PASS_LEN } from '@polkadot/ui-keyring/defaults';
// import { useToggle } from '@polkadot/react-hooks';

// import Button from './Button';
import Input from './Input';

interface Props extends BareProps {
  autoFocus?: boolean;
  children?: React.ReactNode;
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

function Password ({ autoFocus, children, className = '', defaultValue, help, isDisabled, isError, isFull, label, labelExtra, name, onChange, onEnter, onEscape, tabIndex, value, withLabel }: Props): React.ReactElement<Props> {
  // const [isVisible, toggleVisible] = useToggle();

  return (
    <Input
      autoFocus={autoFocus}
      className={`ui--Password ${className}`}
      defaultValue={defaultValue}
      help={help}
      isDisabled={isDisabled}
      isError={isError}
      isFull={isFull}
      label={label}
      labelExtra={labelExtra}
      maxLength={MAX_PASS_LEN}
      name={name}
      onChange={onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      tabIndex={tabIndex}
      // type={
      //   isVisible
      //     ? 'text'
      //     : 'password'
      // }
      type='password'
      value={value}
      withLabel={withLabel}
    >
      {/* <Button
        icon={
          isVisible
            ? 'hide'
            : 'unhide'
        }
        onClick={toggleVisible}
      /> */}
      {children}
    </Input>
  );
}

export default React.memo(Password);
