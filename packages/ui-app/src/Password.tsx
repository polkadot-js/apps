// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { MAX_PASS_LEN } from '@polkadot/ui-keyring/defaults';

import { classes } from './util';
import Button from './Button';
import Input from './Input';

type Props = BareProps & {
  autoFocus?: boolean,
  children?: React.ReactNode,
  defaultValue?: any,
  help?: string,
  isDisabled?: boolean,
  isError?: boolean,
  label?: string,
  name?: string,
  onChange: (value: string) => void,
  onEnter?: () => void,
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
    const { autoFocus, children, className, defaultValue, help, isDisabled, isError, label, name, onChange, onEnter, style, tabIndex, value, withLabel } = this.props;
    const { isVisible } = this.state;

    return (
      <Input
        autoFocus={autoFocus}
        className={classes('ui--Password', className)}
        defaultValue={defaultValue}
        help={help}
        isAction
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        maxLength={MAX_PASS_LEN}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
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

  private onToggleVisible = (): void => {
    this.setState({
      isVisible: !this.state.isVisible
    });
  }
}
