// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props as BareProps } from '../types';

import BN from 'bn.js';
import React from 'react';

import InputNumber from '../../InputNumber';
import Bare from './Bare';

type Props = BareProps;

class Balance extends React.PureComponent<Props> {
  render () {
    const { defaultValue: { value } } = this.props;
    const defaultValue = new BN(value as BN || '0').toString(10);

    return (
      <Bare {...this.props}>
        <InputNumber
          {...this.props}
          className='large'
          defaultValue={defaultValue || '0'}
          onChange={this.onChange}
        />
      </Bare>
    );
  }

  onChange = (value: BN): void => {
    const { isError, onChange } = this.props;

    if (!onChange) {
      return;
    }

    onChange({
      isValid: !isError,
      value
    });
  }
}

export {
  Balance
};

export default Balance;
