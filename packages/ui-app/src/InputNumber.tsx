// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { RawParam$OnChange } from './Params/types';
import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';

import isValidBalance from './util/isValidBalance';
import { keydown } from './util/keyboard';
import classes from './util/classes';
import Input from './Input';
import { KEYS_ALLOWED, KEYS_PRE } from './constants';

type Props = BareProps & {
  defaultValue?: string,
  isError?: boolean,
  label?: any,
  maxLength?: number,
  onChange?: RawParam$OnChange | undefined,
  placeholder?: string,
  t: TranslationFunction,
  withLabel?: boolean
};

type State = {
  error?: React.ReactNode,
  info?: React.ReactNode,
  warn?: React.ReactNode,
  isPreKeyDown: boolean
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
    const { t } = this.props;
    const { isPreKeyDown } = this.state;

    // only allow user balance input to contain one instance of '.' for decimals.
    // prevent use of shift key
    if (
      (keydown.isDuplicateDecimalPoint(event.key, (event.target as HTMLInputElement).value)) ||
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
      this.setState({
        error: t('balance.error.format', {
          defaultValue: 'Balance in DOTs must be a positive number'
        })
      });
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

export default InputNumber;
