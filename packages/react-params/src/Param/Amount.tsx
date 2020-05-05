// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import BN from 'bn.js';
import React from 'react';
import { registry } from '@polkadot/react-api';
import { Input } from '@polkadot/react-components';
import { ClassOf } from '@polkadot/types';
import { bnToBn, formatNumber } from '@polkadot/util';

import Bare from './Bare';

function onChange ({ onChange }: Props): (_: string) => void {
  return function (value: string): void {
    onChange && onChange({
      isValid: true,
      value: new BN(value || 0)
    });
  };
}

function Amount (props: Props): React.ReactElement<Props> {
  const { className, defaultValue: { value }, isDisabled, isError, label, onEnter, style, withLabel } = props;
  const defaultValue = isDisabled
    ? (
      value instanceof ClassOf(registry, 'AccountIndex')
        ? value.toString()
        : formatNumber(value)
    )
    : bnToBn((value as number) || 0).toString();

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
        min={0}
        onChange={onChange(props)}
        onEnter={onEnter}
        type={
          isDisabled
            ? 'text'
            : 'number'
        }
        withEllipsis
        withLabel={withLabel}
      />
    </Bare>
  );
}

export default React.memo(Amount);
