// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';

import Input from './Input';

type Props = BareProps & {
  defaultValue?: mixed,
  children?: React$Node,
  isError?: boolean,
  label?: string,
  name?: string,
  onChange: (value: string) => void,
  value: mixed
};

type State = {
  isVisible: boolean
}

export default class Password extends React.PureComponent<Props, State> {
  state: State = {
    isVisible: false
  };

  render (): React$Node {
    const { children, className, defaultValue, isError = false, label, name, onChange, style, value } = this.props;
    const { isVisible } = this.state;

    return (
      <Input
        className={className}
        defaultValue={defaultValue}
        isAction
        isError={isError}
        label={label}
        name={name}
        onChange={onChange}
        style={style}
        type={
          isVisible
            ? 'text'
            : 'password'
        }
        value={value}
      >
        <Button
          icon='eye'
          primary
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
