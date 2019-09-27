// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';
import { Dropdown } from '@polkadot/react-components';

import Bare from './Bare';

const options = [
  { text: 'No', value: false },
  { text: 'Yes', value: true }
];

function onChange ({ onChange }: Props): (_: boolean) => void {
  return function (value: boolean): void {
    onChange && onChange({
      isValid: true,
      value
    });
  };
}

export default function BoolParam (props: Props): React.ReactElement<Props> {
  const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = props;
  const defaultValue = value instanceof Boolean
    ? value.valueOf()
    : value as boolean;

  return (
    <Bare
      className={className}
      style={style}
    >
      <Dropdown
        className='full'
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        options={options}
        onChange={onChange(props)}
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}
