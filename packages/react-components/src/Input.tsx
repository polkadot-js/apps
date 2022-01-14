// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import { Input as SUIInput } from 'semantic-ui-react';

import { isFunction, isUndefined } from '@polkadot/util';

import Labelled from './Labelled';

type Input$Type = 'number' | 'password' | 'text';

interface Props {
  autoFocus?: boolean;
  children?: React.ReactNode;
  className?: string;
  defaultValue?: string | null;
  help?: React.ReactNode;
  icon?: React.ReactNode;
  inputClassName?: string;
  isAction?: boolean;
  isDisabled?: boolean;
  isDisabledError?: boolean;
  isEditable?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isHidden?: boolean;
  isInPlaceEditor?: boolean;
  isReadOnly?: boolean;
  isSmall?: boolean;
  isWarning?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  max?: number;
  maxLength?: number;
  min?: number;
  name?: string;
  onEnter?: boolean | (() => void);
  onEscape?: () => void;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<Element>) => void;
  onKeyUp?: (event: React.KeyboardEvent<Element>) => void;
  onKeyPress?: (event: React.KeyboardEvent<Element>) => void;
  onPaste?: (event: React.ClipboardEvent<Element>) => void;
  placeholder?: string;
  tabIndex?: number;
  type?: Input$Type;
  value?: string | null;
  withLabel?: boolean;
  withEllipsis?: boolean;
}

// // Find decimal separator used in current locale
// const getDecimalSeparator = (): string => 1.1
//   .toLocaleString()
//   .replace(/\d/g, '');

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
  // DECIMAL: getDecimalSeparator(),
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  V: 'v',
  X: 'x',
  ZERO: '0'
};

const KEYS_PRE: unknown[] = [KEYS.ALT, KEYS.CMD, KEYS.CTRL];

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

function Input ({ autoFocus = false, children, className, defaultValue, help, icon, inputClassName, isAction = false, isDisabled = false, isDisabledError = false, isEditable = false, isError = false, isFull = false, isHidden = false, isInPlaceEditor = false, isReadOnly = false, isWarning = false, label, labelExtra, max, maxLength, min, name, onBlur, onChange, onEnter, onEscape, onKeyDown, onKeyUp, onPaste, placeholder, tabIndex, type = 'text', value, withEllipsis, withLabel }: Props): React.ReactElement<Props> {
  const [stateName] = useState(() => `in_${counter++}_at_${Date.now()}`);

  const _onBlur = useCallback(
    () => onBlur && onBlur(),
    [onBlur]
  );

  const _onChange = useCallback(
    ({ target }: React.SyntheticEvent<HTMLInputElement>): void =>
      onChange && onChange((target as HTMLInputElement).value),
    [onChange]
  );

  const _onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void =>
      onKeyDown && onKeyDown(event),
    [onKeyDown]
  );

  const _onKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      onKeyUp && onKeyUp(event);

      if (onEnter && event.keyCode === 13) {
        (event.target as HTMLInputElement).blur();
        isFunction(onEnter) && onEnter();
      }

      if (onEscape && event.keyCode === 27) {
        (event.target as HTMLInputElement).blur();
        onEscape();
      }
    },
    [onEnter, onEscape, onKeyUp]
  );

  const _onPaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>): void =>
      onPaste && onPaste(event),
    [onPaste]
  );

  return (
    <Labelled
      className={className}
      help={help}
      isFull={isFull}
      label={label}
      labelExtra={labelExtra}
      withEllipsis={withEllipsis}
      withLabel={withLabel}
    >
      <SUIInput
        action={isAction}
        autoFocus={autoFocus}
        className={[
          isEditable
            ? 'ui--Input edit icon'
            : 'ui--Input',
          isInPlaceEditor
            ? 'inPlaceEditor'
            : '',
          inputClassName || '',
          isWarning && !isError
            ? 'isWarning'
            : ''
        ].join(' ')}
        defaultValue={
          isUndefined(value)
            ? (defaultValue || '')
            : undefined
        }
        disabled={isDisabled}
        error={(!isDisabled && isError) || isDisabledError}
        hidden={isHidden}
        iconPosition={
          isUndefined(icon)
            ? undefined
            : 'left'
        }
        id={name}
        max={max}
        maxLength={maxLength}
        min={min}
        name={name || stateName}
        onBlur={_onBlur}
        onChange={_onChange}
        onKeyDown={_onKeyDown}
        onKeyUp={_onKeyUp}
        placeholder={placeholder}
        readOnly={isReadOnly}
        tabIndex={tabIndex}
        type={type}
        value={value}
      >
        <input
          autoCapitalize='off'
          autoComplete={
            type === 'password'
              ? 'new-password'
              : 'off'
          }
          autoCorrect='off'
          data-testid={label}
          onPaste={_onPaste}
          spellCheck={false}
        />
        {isEditable && (
          <i className='edit icon' />
        )}
        {icon}
        {children}
      </SUIInput>
    </Labelled>
  );
}

export default React.memo(Input);

export {
  isCopy,
  isCut,
  isPaste,
  isSelectAll,
  KEYS,
  KEYS_PRE
};
