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

class Balance extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      error: '',
      info: ''
    };
  }

  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, t, withLabel } = this.props;
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
          // min='1'
          // step='1'
          withLabel={withLabel}
        />
        <Notification error={error} info={info} />
      </Bare>
    );
  }

  onChange = (value: string): void => {
    const { onChange, t } = this.props;

    console.log('onChange value: ', value);

    // prepare value by remove all whitespace
    value = value.split(' ').join('');

    try {
      const { isValid, errorMessage, infoMessage } = isValidBalance(value);

      this.setState({
        error: !isValid && errorMessage ? t(errorMessage) : '',
        info: isValid && infoMessage ? t(infoMessage) : ''
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
    const { t } = this.props;

    console.log('onKeyDown event.keyCode: ', event.keyCode);

    // allow input of delete key (8) to undo input
    // allow input of tab key (9) to change to next input field
    // allow left/right arrow keys (37, 39) to change values
    // allow SHIFT, CTRL, ALT (16, 17, 18) for copy/paste input values
    // allow CMD (86), x (88), c (67), or v (91) to paste an input value
    // allow e (69), + (187) for scientific notation
    if ([8, 9, 16, 17, 18, 37, 39, 67, 69, 86, 88, 91, 187].includes(event.keyCode)) {
      return;
    }

    // prevent input of non-integer values
    if (event.keyCode < 48 || event.keyCode > 57) {
      this.setState({
        error: t('Non-numeric values are not permitted')
      });
      event.preventDefault();
    }
  }

  onKeyUp = (event: any): void => {
    console.log('onKeyUp event.keyCode: ', event.keyCode);

    // remove preceding 0's in the value even if user tries to add them to the start
    if (event.target.value.substring(0, 1) === '0') {
      event.target.value = event.target.value.replace(/^0+/g, '');
    }

    // remove any c, v, or x values (case insensitive) immediately when entered by user since
    // we allow those keys so user may copy/cut/paste
    const regexCopyCutPaste = /[c|v|x]/gi;

    if (event.target.value.match(regexCopyCutPaste)) {
      event.target.value = event.target.value
        .replace(/c+/gi, '')
        .replace(/v+/gi, '')
        .replace(/x+/gi, '');
    }

    // after user inputs the value of 'e' or 'E', replace it with 'e'
    const regexE = /[e]/gi;

    if (event.target.value.match(regexE)) {
      event.target.value = event.target.value
        .replace(/e+/gi, 'e');
    }
  }
}

export default withApi(translate(Balance));
