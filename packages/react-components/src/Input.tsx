// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VoidFn } from '@canvas-ui/react-util/types';
import React, { useCallback, useState } from 'react';
import SUIInput from 'semantic-ui-react/dist/commonjs/elements/Input/Input';

import { isFunction, isUndefined } from '@polkadot/util';

import InputStatus from './InputStatus';
import Labelled from './Labelled';
import { BareProps } from './types';

type Input$Type = 'number' | 'password' | 'text';

interface Props extends BareProps {
  autoFocus?: boolean;
  children?: React.ReactNode;
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
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  max?: number;
  maxLength?: number;
  min?: number;
  name?: string;
  onEnter?: boolean | VoidFn;
  onEscape?: () => void;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<Element>) => void;
  onKeyUp?: (event: React.KeyboardEvent<Element>) => void;
  onKeyPress?: (event: React.KeyboardEvent<Element>) => void;
  onPaste?: (event: React.ClipboardEvent<Element>) => void;
  placeholder?: string;
  status?: React.ReactNode;
  tabIndex?: number;
  type?: Input$Type;
  value?: string | null;
  withLabel?: boolean;
  withEllipsis?: boolean;
  withStatus?: boolean;
}

// Find decimal separator used in current locale
const getDecimalSeparator = (): string => 1.1
  .toLocaleString()
  .replace(/\d/g, '');

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
  DECIMAL: getDecimalSeparator(),
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  V: 'v',
  X: 'x',
  ZERO: '0'
};

const KEYS_PRE: any[] = [KEYS.ALT, KEYS.CMD, KEYS.CTRL];

let counter = 0;

function Input ({ autoFocus = false, children, className, defaultValue, help, icon, inputClassName, isAction = false, isDisabled = false, isDisabledError = false, isEditable = false, isError = false, isFull = false, isHidden = false, isInPlaceEditor = false, isReadOnly = false, label, labelExtra, max, maxLength, min, name, onBlur, onChange, onEnter, onEscape, onKeyDown, onKeyUp, onPaste, placeholder, status, tabIndex, type = 'text', value, withEllipsis, withLabel, withStatus = false }: Props): React.ReactElement<Props> {
  const [stateName] = useState(`in_${counter++}_at_${Date.now()}`);

  const _onBlur = useCallback(
    () => onBlur && onBlur(),
    [onBlur]
  );

  const _onChange = useCallback(
    ({ target }: React.SyntheticEvent<HTMLInputElement>): void => {
      onChange && onChange((target as HTMLInputElement).value);
    },
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
        className={
          [
            isEditable
              ? 'ui--Input edit icon'
              : 'ui--Input',
            isInPlaceEditor
              ? 'inPlaceEditor'
              : '',
            isDisabled
              ? 'retain-appearance'
              : '',
            inputClassName || ''
          ].join(' ')
        }
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
          onPaste={_onPaste}
          spellCheck={false}
        />
        {isEditable && (
          <i className='edit icon' />
        )}
        {icon}
      </SUIInput>
      {withStatus && (
        <InputStatus
          isError={isError}
          isValid={!isError}
          text={status}
        />
      )}
      {children}
    </Labelled>
  );
}

export default React.memo(Input);

export {
  KEYS,
  KEYS_PRE
};
