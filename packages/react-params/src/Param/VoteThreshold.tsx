// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';
import { ClassOf } from '@polkadot/types';
import { Dropdown } from '@polkadot/react-components';
import { bnToBn } from '@polkadot/util';

import Bare from './Bare';

type TextMap = Record<number, string>;

const options = [
  { text: 'Super majority approval', value: 0 },
  { text: 'Super majority rejection', value: 1 },
  { text: 'Simple majority', value: 2 }
];

export const textMap = options.reduce((textMap, { text, value }): TextMap => {
  textMap[value] = text;

  return textMap;
}, {} as unknown as TextMap);

function onChange ({ onChange }: Props): (_: number) => void {
  return function (value: number): void {
    onChange && onChange({
      isValid: true,
      value
    });
  };
}

export default function VoteThresholdParam (props: Props): React.ReactElement<Props> {
  const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = props;
  const defaultValue = value instanceof ClassOf('VoteThreshold')
    ? value.toNumber()
    : bnToBn(value as number).toNumber();

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
        withLabel={withLabel}
      />
    </Bare>
  );
}
