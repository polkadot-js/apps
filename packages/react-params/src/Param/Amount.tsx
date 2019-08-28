// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import BN from 'bn.js';
import React from 'react';
import { ClassOf } from '@polkadot/types';
import { Input } from '@polkadot/react-components';
import { bnToBn, formatNumber } from '@polkadot/util';

import Bare from './Bare';

export default class Amount extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, defaultValue: { value }, isDisabled, isError, label, onEnter, style, withLabel } = this.props;
    const defaultValue = isDisabled
      ? (
        value instanceof ClassOf('AccountIndex')
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
          onChange={this.onChange}
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

  private onChange = (value: string): void => {
    const { onChange } = this.props;

    onChange && onChange({
      isValid: true,
      value: new BN(value || 0)
    });
  }
}
