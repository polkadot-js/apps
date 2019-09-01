// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';
import { Input } from '@polkadot/react-components';

import Bare from './Bare';

function onChange ({ onChange }: Props): (_: string) => void {
  return function (value: string): void {
    const isValid = value.length !== 0;

    onChange && onChange({
      isValid,
      value
    });
  };
}

export default function Text (props: Props): React.ReactNode {
  const { className, defaultValue: { value }, isDisabled, isError, label, onEnter, style, withLabel } = props;
  const defaultValue = (value || '').toString();

  return (
    <Bare
      className={className}
      style={style}
    >
      <Input
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={onChange(props)}
        onEnter={onEnter}
        placeholder='<any string>'
        type='text'
        withLabel={withLabel}
      />
    </Bare>
  );
}
