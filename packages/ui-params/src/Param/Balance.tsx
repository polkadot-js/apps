// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BareProps } from '../types';

import BN from 'bn.js';
import React from 'react';
import { InputBalance } from '@polkadot/ui-app';

import Bare from './Bare';

type Props = BareProps;

class Balance extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, onEnter, style, withLabel } = this.props;
    const defaultValue = new BN((value as BN || '0').toString()).toString(10);

    return (
      <Bare
        className={className}
        style={style}
      >
        <InputBalance
          className={isDisabled ? 'full' : 'large'}
          defaultValue={defaultValue}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          onChange={this.onChange}
          withEllipsis
          onEnter={onEnter}
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  private onChange = (value?: BN): void => {
    const { isError, onChange } = this.props;

    if (!onChange) {
      return;
    }

    onChange({
      isValid: !isError && !!value,
      value
    });
  }
}

export {
  Balance
};

export default Balance;
