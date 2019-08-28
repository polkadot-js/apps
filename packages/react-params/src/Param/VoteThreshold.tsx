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

export default class VoteThresholdParam extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
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
          onChange={this.onChange}
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  private onChange = (value: number): void => {
    const { onChange } = this.props;

    onChange && onChange({
      isValid: true,
      value
    });
  }
}
