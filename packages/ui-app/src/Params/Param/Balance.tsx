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
    const { className, defaultValue: { value }, isDisabled, isError, label, style, t, withLabel } = this.props;
    const { error } = this.state;
    const defaultValue = new BN((value as BN).toString(10) || '0').toString(10);

    const maxLengthForLatestChainSpec = 38;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Input
          className='large'
          defaultValue={defaultValue || '0'}
          isError={isError}
          label={label}
          maxLength={maxLengthForLatestChainSpec}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          placeholder={t('account.balance.placeholder', {
            defaultValue: 'Between 1 testnet DOT and the available testnet DOT balance (minus 1) of the account'
          })}
          type='number'
          min='1'
          step='1'
          withLabel={withLabel}
        />
        <Notification error={error} />
      </Bare>
    );
  }

  onChange = (value: string): void => {
    const { onChange, t } = this.props;

    // prepare value by remove all whitespace
    value = value.split(' ').join('');

    try {
      const { isValid, errorMessage } = isValidBalance(value);

      this.setState({
        error: !isValid && errorMessage ? t(errorMessage) : ''
      });

      if (!onChange) return;

      onChange({
        isValid,
        value: new BN(value || '0')
      });
    } catch (e) {
      console.error('error: ', e);
    }
  }

  onKeyDown = (event: any): void => {
    // ignore decimal point
    if (event.keyCode === 190) {
      event.preventDefault();
    }
  }
}

export default withApi(translate(Balance));
