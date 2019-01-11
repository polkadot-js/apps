// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import BN from 'bn.js';
import React from 'react';
import { Input } from '@polkadot/ui-app/index';
import numberFormat from '@polkadot/ui-reactive/util/numberFormat';

import Bare from './Bare';

export default class Amount extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    const defaultValue = isDisabled
      ? numberFormat(value)
      : (
        value instanceof BN
          ? value.toNumber()
          : new BN((value as number) || 0).toNumber()
      );

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className={isDisabled ? 'full' : 'small'}
          defaultValue={defaultValue}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          min={0}
          onChange={this.onChange}
          type={
            isDisabled
              ? 'text'
              : 'number'
          }
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
