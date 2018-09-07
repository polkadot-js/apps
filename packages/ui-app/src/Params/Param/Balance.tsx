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
import { defaultMaxLength } from '../../util/chainSpec';
import { keydown } from '../../util/keyboard';
import InputNumber from '../../InputNumber';
import translate from '../../translate';
import { KEYS_ALLOWED, KEYS_PRE } from '../../constants';
import Bare from './Bare';

type Props = I18nProps & ApiProps & BareProps;

type State = {
  error?: React.ReactNode,
  info?: React.ReactNode,
  warn?: React.ReactNode,
  isPreKeyDown: boolean
};

class Balance extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      error: '',
      warn: '',
      info: '',
      isPreKeyDown: false
    };
  }

  render () {
    const { className, defaultValue: { value }, isError, label, style, t, withLabel } = this.props;
    const { error, info, warn } = this.state;
    const defaultValue = new BN((value as BN).toString(10) || '0').toString(10);

    return (
      <Bare
        className={className}
        style={style}
      >
        <InputNumber
          className='large'
          defaultValue={defaultValue || '0'}
          error={error}
          info={info}
          isError={isError}
          label={label}
          maxLength={defaultMaxLength}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          placeholder={t('account.balance.placeholder', {
            defaultValue: 'Between 0 DOT and the available DOT balance of the account'
          })}
          withLabel={withLabel}
          warn={warn}
        />
      </Bare>
    );
  }

  onChange = (value: string): void => {
    const { onChange, t } = this.props;

    try {
      const { isValid, errorMessage, infoMessage, warnMessage } = isValidBalance(value, t);

      this.setState({
        error: !isValid && errorMessage ? errorMessage : '',
        info: isValid && infoMessage ? infoMessage : '',
        warn: isValid && warnMessage ? warnMessage : ''
      });

      if (!onChange) {
        return;
      }

      let valueBN: BN;
      valueBN = new BN(value || '0');

      onChange({
        isValid,
        value: valueBN
      });
    } catch (error) {
      console.error(error);
    }
  }

  onKeyDown = (event: any): void => {
    const { t } = this.props;
    const { isPreKeyDown } = this.state;

    // only allow user balance input to contain one instance of '.' for decimals.
    // prevent use of shift key
    if (
      (keydown.isDuplicateDecimalPoint(event)) ||
      (keydown.isShift(event))
    ) {
      event.preventDefault();
      return;
    }

    if (KEYS_ALLOWED.includes(event.key)) {
      return;
    }

    if (KEYS_PRE.includes(event.key)) {
      this.setState({ isPreKeyDown: true });
    }

    // allow users to to use cut/copy/paste combinations, but not non-numeric letters individually
    if (
      (keydown.isSelectAll(event, isPreKeyDown)) ||
      (keydown.isCut(event, isPreKeyDown)) ||
      (keydown.isCopy(event, isPreKeyDown)) ||
      (keydown.isPaste(event, isPreKeyDown))
    ) {
      return;
    }

    // prevent input of non-integer values (allow numeric including from keyboards with numpad)
    if (keydown.isNonNumeric(event)) {
      this.setState({
        error: t('balance.error.format', {
          defaultValue: 'Balance to transfer in DOTs must be a number'
        })
      });
      event.preventDefault();
      return;
    }
  }

  onKeyUp = (event: any): void => {
    if (KEYS_PRE.includes(event.key)) {
      this.setState({ isPreKeyDown: false });
    }
  }
}

export {
  Balance
};

export default withApi(translate(Balance));
