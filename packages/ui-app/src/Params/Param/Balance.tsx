// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props as BareProps } from '../types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import isValidBalance from '../../util/isValidBalance';

import BN from 'bn.js';
import React from 'react';

import Input from '../../Input';
import Bare from './Bare';

import withApi from '@polkadot/ui-react-rx/with/api';

import translate from '../../translate';

type Props = I18nProps & ApiProps & BareProps;

class Balance extends React.PureComponent<Props> {
  render () {
    const { apiSupport, className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    const defaultValue = String(new BN(String(value) || 0));

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className='large'
          defaultValue={defaultValue || String(0)}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          maxLength={apiSupport === 'poc-1' ? 19 : 38}
          onChange={this.onChange}
          placeholder='<any number between 1 testnet DOT and the available testnet DOT balance minus 1>'
          type='text'
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  onChange = (value: string): void => {
    const { onChange, apiSupport } = this.props;

    const isValid = isValidBalance(value.trim(), apiSupport);

    onChange({
      isValid,
      value: new BN(String(value.trim()) || '0')
    });
  }
}

export default withApi(translate(Balance));
