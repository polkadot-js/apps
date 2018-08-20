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
  error?: React.ReactNode,
  info?: React.ReactNode
};

class InputNumber extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      error: '',
      info: ''
    };
  }

  render () {
    const { className, defaultValue: { value }, isError, label, style, t, withLabel } = this.props;
    const { error, info } = this.state;
    const defaultValue = new BN((value as BN).toString(10) || '0').toString(10);

    const maxLengthForLatestChainSpec = 39;

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
          onKeyUp={this.onKeyUp}
          placeholder={t('account.balance.placeholder', {
            defaultValue: 'Between 1 testnet DOT and the available testnet DOT balance (minus 1) of the account'
          })}
          type='text'
          withLabel={withLabel}
        />
        <Notification error={error} info={info} />
      </Bare>
    );
  }

  onChange = (value: string): void => {
    const { onChange, t } = this.props;

    // prepare value by remove all whitespace
    value = value.split(' ').join('');

    try {
      const { isValid, errorMessage, infoMessage, inputConvertedFromScientificNotation } = isValidBalance(value);

      this.setState({
        error: !isValid && errorMessage ? t(errorMessage) : '',
        info: isValid && infoMessage ? t(infoMessage) : ''
      });

      if (!onChange) return;

      let newValue: BN;
      if (inputConvertedFromScientificNotation) {
        newValue = new BN(inputConvertedFromScientificNotation);
      } else {
        newValue = new BN(value || '0');
      }

      onChange({
        isValid,
        value: newValue
      });
    } catch (e) {
      console.error('error: ', e);
    }
  }

  onKeyDown = (event: any): void => {
    const { t } = this.props;

    const altKey = 18;
    const arrowLeftKey = 37;
    const arrowRightKey = 39;
    const backspaceKey = 46;
    const cmdKey = event.metaKey; // firefox (91), safari (224)
    const ctrlKey = 17;
    const decimalPointKey = 190; // decimals allowed for scientific or exponential notation
    const delKey = 8;
    const escapeKey = 27;
    const enterKey = 13;
    const plusKey = 187; // '+'
    const tabKey = 9; // next input field
    const aKey = 65; // select all from balance input
    const xKey = 88; // cut balance
    const cKey = 67; // copy balance
    const eKey = 69; // scientific or exponential notation
    const vKey = 86; // paste balance

    const regexE = /[e]/gi;
    const regexPlus = /[\+]/gi;
    const regexDecimalPoint = /[\.]/gi;

    // only allow user balance input to contain one instance of 'e', '+', and '.' for decimal in scientific or exponential notation
    if (
      (event.keyCode === eKey && event.target.value.match(regexE)) ||
      (event.keyCode === plusKey && event.target.value.match(regexPlus)) ||
      (event.keyCode === decimalPointKey && event.target.value.match(regexDecimalPoint))
    ) {
      event.preventDefault();
      return;
    }

    // obtain the current cursor index position in the Balance input field
    const inputCursorIndex = event.target.value.slice(0, event.target.selectionStart).length;

    // allow these keys
    if ([escapeKey, enterKey, backspaceKey, delKey, tabKey, ctrlKey, altKey, cmdKey, eKey, arrowLeftKey,
      arrowRightKey, decimalPointKey].includes(event.keyCode)) {
      return;
    }

    // prevent user entering the '+' symbol unless immediately after the 'e' letter (i.e. 'e+') for exponential notation
    if (event.keyCode === plusKey && event.target.value.charAt(inputCursorIndex - 1) !== 'e') {
      event.preventDefault();
      return;
    }

    // allow users to to use cut/copy/paste combinations, but not non-numeric letters individually
    // allow users to use the + key for exponential notation
    if (
      ((event.ctrlKey || cmdKey) && event.which === aKey) || // select all
      ((event.ctrlKey || cmdKey) && event.which === cKey) || // copy
      ((event.ctrlKey || cmdKey) && event.which === vKey) || // paste
      ((event.ctrlKey || cmdKey) && event.which === xKey) || // cut
      event.shiftKey && event.which === plusKey              // '+' for exponential notation (i.e. 'e+')
    ) {
      return;
    }

    // prevent input of non-integer values (allow numeric including from keyboards with numpad)
    if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
      this.setState({
        error: t('Non-numeric values are not permitted')
      });
      event.preventDefault();
      return;
    }
  }

  onKeyUp = (event: any): void => {
    // remove preceding 0's in the value even if user tries to add them to the start
    if (event.target.value.substring(0, 1) === '0') {
      event.target.value = event.target.value.replace(/^0+/g, '');
    }

    // if user inputs the value of 'E', replace it with lowercase 'e'
    const regexE = /[E]/gi;

    if (event.target.value.match(regexE)) {
      event.target.value = event.target.value
        .replace(/E+/gi, 'e');
    }
  }
}

export default withApi(translate(InputNumber));
