// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, SUIEvent } from './types';

import React from 'react';

import classes from './util/classes';
import Input from './Input';

type Props = BareProps & {
  defaultValue?: string,
  error?: React.ReactNode,
  info?: React.ReactNode,
  isError?: boolean,
  label?: any,
  maxLength?: number,
  onChange: (value: string) => void,
  onKeyDown?: (event: SUIEvent) => void,
  onKeyUp?: (event: SUIEvent) => void,
  placeholder?: string,
  withLabel?: boolean
};

class InputNumber extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, error, info, isError, label, maxLength, onChange, onKeyDown, onKeyUp, placeholder, style, withLabel } = this.props;

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
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          placeholder={placeholder}
          style={style}
          type='text'
          withLabel={withLabel}
        />
      </div>
    );
  }
}

export default InputNumber;
