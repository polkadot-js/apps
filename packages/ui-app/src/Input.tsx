// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUIInput from 'semantic-ui-react/dist/commonjs/elements/Input/Input';

import isUndefined from '@polkadot/util/is/undefined';

import Labelled from './Labelled';
import Notification from './Notification';

type Input$Type = 'number' | 'password' | 'text';

type Props = BareProps & {
  children?: React.ReactNode,
  autoFocus?: boolean,
  defaultValue?: any,
  error?: React.ReactNode,
  icon?: any, // node?
  isAction?: boolean,
  isDisabled?: boolean,
  isEditable?: boolean,
  isError?: boolean,
  isHidden?: boolean,
  label?: any, // node?
  max?: any,
  min?: any,
  name?: string,
  onChange: (value: string) => void,
  placeholder?: string,
  tabIndex?: number,
  type?: Input$Type,
  value?: any,
  withLabel?: boolean
};

type SUIEvent = {
  value: any
};

type State = {
  name: string;
};

let counter = 0;

export default class Input extends React.PureComponent<Props, State> {
  state: State = {
    name: `in_${counter++}_at_${Date.now()}`
  };

  render () {
    const { children, autoFocus = false, className, defaultValue, error, icon, isEditable = false, isAction = false, isDisabled = false, isError = false, isHidden = false, label, max, min, name, placeholder, style, tabIndex, type = 'text', value, withLabel } = this.props;

    return (
      <Labelled
        className={className}
        label={label}
        style={style}
        withLabel={withLabel}
      >
        <SUIInput
          action={isAction}
          autoFocus={autoFocus}
          className={isEditable ? 'edit icon' : ''}
          defaultValue={defaultValue}
          disabled={isDisabled}
          id={name}
          iconPosition={
            isUndefined(icon)
              ? void 0
              : 'left'
          }
          error={isError}
          hidden={isHidden}
          max={max}
          min={min}
          name={name || this.state.name}
          onChange={this.onChange}
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
          />
          {isEditable ? <i className='edit icon' /> : null}
          {icon}
          {children}
        </SUIInput>
        <Notification error={error} />
      </Labelled>
    );
  }

  onChange = (event: React.SyntheticEvent<Element>, { value }: SUIEvent): void => {
    this.props.onChange(value);
  }
}
