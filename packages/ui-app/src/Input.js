// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import SUIInput from 'semantic-ui-react/dist/es/elements/Input';

import isUndefined from '@polkadot/util/is/undefined';

import Labelled from './Labelled';

type Input$Type = 'number' | 'password' | 'text';

type Props = BareProps & {
  children?: React$Node,
  defaultValue?: mixed,
  icon?: React$Node,
  isAction?: boolean,
  isDisabled?: boolean,
  isError?: boolean,
  isHidden?: boolean,
  label?: React$Node,
  max?: mixed,
  min?: mixed,
  onChange: (value: string) => void,
  placeholder?: string,
  type?: Input$Type,
  value?: mixed,
  withLabel?: boolean
};

type SUIEvent = {
  // flowlint-next-line unclear-type:off
  value: any
};

type State = {
  name: string;
}

let counter = 0;

export default class Input extends React.PureComponent<Props, State> {
  state: State = {
    name: `in_${counter++}_at_${Date.now()}`
  };

  render (): React$Node {
    const { children, className, defaultValue, icon, isAction = false, isDisabled = false, isError = false, isHidden = false, label, max, min, placeholder, style, type = 'text', value, withLabel } = this.props;
    const { name } = this.state;

    return (
      <Labelled
        className={className}
        label={label}
        style={style}
        withLabel={withLabel}
      >
        <SUIInput
          action={isAction}
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
          name={name}
          onChange={this.onChange}
          placeholder={placeholder}
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
          {icon}
          {children}
        </SUIInput>
      </Labelled>
    );
  }

  onChange = (event: SyntheticEvent<Element>, { value }: SUIEvent): void => {
    this.props.onChange(value);
  }
}
