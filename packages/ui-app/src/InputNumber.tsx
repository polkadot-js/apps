// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';

import isValidBalance from './util/isValidBalance';
import { keydown } from './util/keyboard';
import classes from './util/classes';
import Input from './Input';
import { KEYS_ALLOWED, KEYS_PRE } from './constants';
import translate from './translate';

type Props = BareProps & I18nProps & {
  defaultValue?: string,
  isError?: boolean,
  label?: any,
  maxLength?: number,
  onChange?: (value: { isValid: boolean, value: BN }) => void,
  placeholder?: string,
  withLabel?: boolean
};

type State = {
  error?: React.ReactNode,
  info?: React.ReactNode,
  isPreKeyDown: boolean,
  warn?: React.ReactNode
};

class InputNumber extends React.PureComponent<Props, State> {
  state: State = { isPreKeyDown: false };

  render () {
    const { className, defaultValue, isError, label, maxLength, placeholder, style, withLabel } = this.props;
    const { error, info, warn } = this.state;

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
          warn={warn}
          withLabel={withLabel}
        />
      </div>
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

      let valueBN: BN;
      valueBN = new BN(value || '0');

      if (!onChange) {
        return;
      }

      onChange({
        isValid,
        value: valueBN
      });
    } catch (error) {
      console.error(error);
    }
  }

  onKeyDown = (event: React.KeyboardEvent<Element>): void => {
    const { isPreKeyDown } = this.state;
    const eventValue = (event.target as HTMLInputElement).value;

    // only allow user balance input to contain one instance of '.' for decimals.
    // prevent use of shift key
    if (
      (keydown.isDuplicateDecimalPoint(event.key, eventValue)) ||
      (keydown.isShift(event.shiftKey))
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
      (keydown.isSelectAll(event.key, isPreKeyDown)) ||
      (keydown.isCut(event.key, isPreKeyDown)) ||
      (keydown.isCopy(event.key, isPreKeyDown)) ||
      (keydown.isPaste(event.key, isPreKeyDown))
    ) {
      return;
    }

    // prevent input of non-integer values (allow numeric including from keyboards with numpad)
    if (keydown.isNonNumeric(event.key)) {
      console.error('Balance must be a positive number');
      event.preventDefault();
      return;
    }

    const inputBN = new BN(eventValue);
    const maxSafeIntegerBN = new BN(Number.MAX_SAFE_INTEGER);

    if (inputBN.gt(maxSafeIntegerBN)) {
      event.preventDefault();
      return;
    }
  }

  onKeyUp = (key: string): void => {
    if (KEYS_PRE.includes(key)) {
      this.setState({ isPreKeyDown: false });
    }
  }
}

export default translate(InputNumber);
