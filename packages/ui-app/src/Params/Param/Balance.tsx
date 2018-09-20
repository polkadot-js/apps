// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';
import { I18nProps } from '../../types';
import { Props as BareProps } from '../types';

import BN from 'bn.js';
import React from 'react';
import withApi from '@polkadot/ui-react-rx/with/api';

import InputNumber from '../../InputNumber';
import translate from '../../translate';
import Bare from './Bare';

type Props = I18nProps & ApiProps & BareProps;

class Balance extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue: { value }, isError, label, style, withLabel } = this.props;
    const defaultValue = new BN((value as BN).toString(10) || '0').toString(10);

    return (
      <Bare
        className={className}
        style={style}
      >
        <InputNumber
          className='large'
          defaultValue={defaultValue || '0'}
          isError={isError}
          label={label}
          onChange={this.onChange}
          withLabel={withLabel}
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

export default withApi(translate(Balance));
