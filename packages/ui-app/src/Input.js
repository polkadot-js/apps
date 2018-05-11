// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import SUIInput from 'semantic-ui-react/dist/es/elements/Input';

import Labelled from './Labelled';

type Props = BareProps & {
  children?: React$Node,
  defaultValue?: mixed,
  isAction?: boolean,
  isDisabled?: boolean,
  isError?: boolean,
  label?: string,
  max?: mixed,
  min?: mixed,
  name?: string,
  // flowlint-next-line unclear-type:off
  onChange: (value: any) => void,
  placeholder?: string,
  type?: string,
  value?: mixed
};

type SUIEvent = {
  // flowlint-next-line unclear-type:off
  value: any
};

export default class Input extends React.PureComponent<Props> {
  render (): React$Node {
    const { children, className, defaultValue, isAction = false, isDisabled = false, isError = false, label, max, min, name, placeholder, style, type = 'text', value } = this.props;

    return (
      <Labelled
        className={className}
        label={label}
        style={style}
      >
        <SUIInput
          action={isAction}
          defaultValue={defaultValue}
          disabled={isDisabled}
          error={isError}
          max={max}
          min={min}
          name={name}
          onChange={this.onChange}
          placeholder={placeholder}
          type={type}
          value={value}
        >
          <input />
          {children}
        </SUIInput>
      </Labelled>
    );
  }

  // eslint-disable-next-line no-unused-var
  onChange = (event: SyntheticEvent<*>, { value }: SUIEvent): void => {
    this.props.onChange(value);
  }
}
