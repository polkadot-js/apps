// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React, { useState } from 'react';
import { MAX_PASS_LEN } from '@polkadot/ui-keyring/defaults';

import { classes } from './util';
import Button from './Button';
import Input from './Input';

interface Props extends BareProps {
  autoFocus?: boolean;
  children?: React.ReactNode;
  defaultValue?: any;
  help?: string;
  isDisabled?: boolean;
  isError?: boolean;
  label?: string;
  name?: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  tabIndex?: number;
  value: any;
  withLabel?: boolean;
}

export default function Password ({ autoFocus, children, className, defaultValue, help, isDisabled, isError, label, name, onChange, onEnter, style, tabIndex, value, withLabel }: Props): React.ReactElement<Props> {
  const [isVisible, setIsVisible] = useState(false);

  const _toggleVisible = (): void => setIsVisible(!isVisible);

  return (
    <Input
      autoFocus={autoFocus}
      className={classes('ui--Password', className)}
      defaultValue={defaultValue}
      help={help}
      isAction
      isDisabled={isDisabled}
      isError={isError}
      label={label}
      maxLength={MAX_PASS_LEN}
      name={name}
      onChange={onChange}
      onEnter={onEnter}
      style={style}
      tabIndex={tabIndex}
      type={
        isVisible
          ? 'text'
          : 'password'
      }
      value={value}
      withLabel={withLabel}
    >
      <Button
        icon={
          isVisible
            ? 'hide'
            : 'unhide'
        }
        isPrimary
        onClick={_toggleVisible}
      />
      {children}
    </Input>
  );
}
