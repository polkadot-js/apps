// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';

import isValidKey from './util/isValidKey';
import isValidNumber from './util/isValidNumber';
import classes from './util/classes';
import Input from './Input';
import { KEYS_PRE } from './constants';
import translate from './translate';

type Props = BareProps & I18nProps & {
  defaultValue?: string,
  isError?: boolean,
  label?: any,
  maxLength?: number,
  onChange: (value: BN) => void,
  placeholder?: string,
  withLabel?: boolean
};

type State = {
  error?: React.ReactNode,
  info?: React.ReactNode,
  isPreKeyDown: boolean,
  isValid: boolean,
  previousValue: string,
  warn?: React.ReactNode
};

class InputNumber extends React.PureComponent<Props, State> {
  state: State = {
    isPreKeyDown: false,
    isValid: false,
    previousValue: '0'
  };

  render () {
    const { className, defaultValue, isError, label, maxLength, placeholder, style, withLabel } = this.props;
    const { error, info, isValid, previousValue, warn } = this.state;
    const shouldRevertValue = !isValid;
    const revertedValue = shouldRevertValue ? previousValue : undefined;

    return (
      <div
        className={classes('ui--InputNumber', className)}
        style={style}
      >
        <Input
          className={className}
          defaultValue={defaultValue || '0'}
          error={error}
          info={info}
          isError={isError}
          label={label}
          maxLength={maxLength}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          placeholder={placeholder}
          style={style}
          type='text'
          value={revertedValue}
          warn={warn}
          withLabel={withLabel}
        />
      </div>
    );
  }

  onChange = (value: string): void => {
    const { onChange, t } = this.props;

    try {
      const valueBN = new BN(value || '0');
      const { isValid, errorMessage, infoMessage, warnMessage } = isValidNumber(value, t);

      this.setState({
        error: !isValid && errorMessage ? errorMessage : '',
        info: infoMessage ? infoMessage : '',
        isValid: isValid,
        warn: isValid && warnMessage ? warnMessage : ''
      });

      if (!onChange || !isValid) {
        return;
      }

      onChange(valueBN);
    } catch (error) {
      console.error(error);
    }
  }

  /* KeyDown used since it can restrict input of certain keys. Its value is the previous input
   * field value before the new character entered. Previous input field value is stored in state
   * incase the user pastes an invalid value and we need to revert the input value.
   */
  onKeyDown = (event: React.KeyboardEvent<Element>): void => {
    const { isPreKeyDown } = this.state;
    const { t } = this.props;
    const { value: previousValue } = event.target as HTMLInputElement;

    this.setState({ previousValue });

    if (KEYS_PRE.includes(event.key)) {
      this.setState({ isPreKeyDown: true });
    }

    const { isValid } = isValidKey(event, isPreKeyDown, t);

    if (!isValid) {
      event.preventDefault();
    }
  }

  onKeyUp = (key: string): void => {
    if (KEYS_PRE.includes(key)) {
      this.setState({ isPreKeyDown: false });
    }
  }
}

export {
  InputNumber
};

export default translate(InputNumber);
