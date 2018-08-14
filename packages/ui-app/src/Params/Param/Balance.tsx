// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-react-rx/types';
import { I18nProps } from '../../types';
import { Props as BareProps } from '../types';

import BN from 'bn.js';
import React from 'react';
import withApi from '@polkadot/ui-react-rx/with/api';

import isValidBalance from '../../util/isValidBalance';
import Input from '../../Input';
import Notification from '../../Notification';
import Bare from './Bare';
import translate from '../../translate';

type Props = I18nProps & ApiProps & BareProps;

type State = {
  error?: React.ReactNode
};

class Balance extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      error: ''
    };
  }

  render () {
    const { apiSupport, className, defaultValue: { value }, isDisabled, isError, label, style, t, withLabel } = this.props;
    const { error } = this.state;
    const defaultValue = new BN((value as BN).toString(10) || '0').toString(10);

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className='large'
          defaultValue={defaultValue || '0'}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          maxLength={apiSupport === 'poc-1' ? 19 : 38}
          onChange={this.onChange}
          placeholder={t('account.balance.placeholder', {
            defaultValue: 'Between 1 testnet DOT and the available testnet DOT balance (minus 1) of the account'
          })}
          type='text'
          withLabel={withLabel}
        />
        <Notification error={error} />
      </Bare>
    );
  }

  onChange = (value: string): void => {
    const { onChange, apiSupport } = this.props;

    const { isValid, errorMessage } = isValidBalance(value.trim(), apiSupport);

    this.setState({
      error: isValid ? '' : errorMessage
    });

    onChange({
      isValid,
      value: new BN(value.trim() || '0')
    });
  }
}

export default withApi(translate(Balance));
