// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUIInput from 'semantic-ui-react/dist/commonjs/elements/Input/Input';
import { isUndefined } from '@polkadot/util';

import Labelled from './Labelled';

type Input$Type = 'number' | 'password' | 'text';

type Props = BareProps & {
  autoFocus?: boolean,
  children?: React.ReactNode,
  defaultValue?: any,
  help?: React.ReactNode,
  icon?: React.ReactNode,
  isAction?: boolean,
  isDisabled?: boolean,
  isEditable?: boolean,
  isError?: boolean,
  isHidden?: boolean,
  label?: React.ReactNode,
  max?: any,
  maxLength?: number,
  min?: any,
  name?: string,
  onChange?: (value: string) => void,
  onBlur?: (event: React.KeyboardEvent<Element>) => void,
  onKeyDown?: (event: React.KeyboardEvent<Element>) => void,
  onKeyUp?: (event: React.KeyboardEvent<Element>) => void,
  onKeyPress?: (event: React.KeyboardEvent<Element>) => void,
  onPaste?: (event: React.ClipboardEvent<Element>) => void,
  placeholder?: string,
  tabIndex?: number,
  type?: Input$Type,
  value?: any,
  withLabel?: boolean
};

type State = {
  name: string;
};

// Find decimal separator used in current locale
const getDecimalSeparator = (): string => Intl.NumberFormat()
    .formatToParts(1.1)
    .find(part => part.type === 'decimal')!
    .value;

// note: KeyboardEvent.keyCode and KeyboardEvent.which are deprecated
const KEYS = {
  A: 'a',
  ALT: 'Alt',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  BACKSPACE: 'Backspace',
  C: 'c',
  CMD: 'Meta',
  CTRL: 'Control',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  V: 'v',
  X: 'x',
  ZERO: '0',
  DECIMAL: getDecimalSeparator()
};

const KEYS_PRE: Array<any> = [KEYS.ALT, KEYS.CMD, KEYS.CTRL];

// reference: degrade key to keyCode for cross-browser compatibility https://www.w3schools.com/jsref/event_key_keycode.asp
const isCopy = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.C;

const isCut = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.X;

const isPaste = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.V;

const isSelectAll = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.A;

let counter = 0;

export default class Input extends React.PureComponent<Props, State> {
  state: State = {
    name: `in_${counter++}_at_${Date.now()}`
  };

  render () {
    const { autoFocus = false, children, className, defaultValue, help, icon, isEditable = false, isAction = false, isDisabled = false, isError = false, isHidden = false, label, max, maxLength, min, name, placeholder, style, tabIndex, type = 'text', value, withLabel } = this.props;

    return (
      <Labelled
        className={className}
        help={help}
        label={label}
        style={style}
        withLabel={withLabel}
      >
        <SUIInput
          action={isAction}
          autoFocus={autoFocus}
          className={
            isEditable
              ? 'ui--Input edit icon'
              : 'ui--Input'
          }
          defaultValue={
            isUndefined(value)
              ? (defaultValue || '')
              : undefined
          }
          disabled={isDisabled}
          error={isError}
          hidden={isHidden}
          id={name}
          iconPosition={
            isUndefined(icon)
              ? undefined
              : 'left'
          }
          max={max}
          maxLength={maxLength}
          min={min}
          name={name || this.state.name}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          placeholder={placeholder}
          tabIndex={tabIndex}
          type={type}
          value={value}
        >
          <input
            autoComplete={
              type === 'password'
                ? 'new-password'
                : 'off'
            }
            onPaste={this.onPaste}
          />
          {
            isEditable
              ? <i className='edit icon' />
              : undefined
          }
          {icon}
          {children}
        </SUIInput>
      </Labelled>
    );
  }

  private onChange = (event: React.SyntheticEvent<Element>): void => {
    const { onChange } = this.props;
    const { value } = event.target as HTMLInputElement;

    onChange && onChange(value);
  }

  private onKeyDown = (event: React.KeyboardEvent<Element>): void => {
    const { onKeyDown } = this.props;

    if (onKeyDown) {
      onKeyDown(event);
    }
  }

  private onKeyUp = (event: React.KeyboardEvent<Element>): void => {
    const { onKeyUp } = this.props;

    if (onKeyUp) {
      onKeyUp(event);
    }
  }

  private onPaste = (event: React.ClipboardEvent<Element>): void => {
    const { onPaste } = this.props;

    if (onPaste) {
      onPaste(event);
    }
  }
}

export {
  isCopy,
  isCut,
  isPaste,
  isSelectAll,
  KEYS,
  KEYS_PRE
};
