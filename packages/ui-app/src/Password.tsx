// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import Button from './Button';
import Input from './Input';

type Props = BareProps & {
  autoFocus?: boolean,
  defaultValue?: any,
  children?: React.ReactNode,
  isDisabled?: boolean,
  isError?: boolean,
  label?: string,
  name?: string,
  onChange: (value: string) => void,
  onKeyDown?: (event: React.KeyboardEvent<Element>) => void,
  tabIndex?: number,
  value: any,
  withLabel?: boolean
};

type State = {
  isVisible: boolean
};

export default class Password extends React.PureComponent<Props, State> {
  state: State = {
    isVisible: false
  };

  render () {
    const { autoFocus, children, className, defaultValue, isDisabled, isError, label, name, onChange, onKeyDown, style, tabIndex, value, withLabel } = this.props;
    const { isVisible } = this.state;

    return (
      <Input
        autoFocus={autoFocus}
        className={className}
        defaultValue={defaultValue}
        isAction
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        name={name}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={style}
        tabIndex={tabIndex}
        type={
          isVisible
            ? 'text'
            : 'password'
        }
        value={value}
        withLabel={withLabel}
      >
        <Button
          icon={
            isVisible
              ? 'hide'
              : 'unhide'
          }
          isPrimary
          onClick={this.onToggleVisible}
        />
        {children}
      </Input>
    );
  }

  onToggleVisible = (): void => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  }
}
