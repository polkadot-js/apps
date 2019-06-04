// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BaseProps } from '../types';

import React from 'react';
import { Enum, TypeDef, createType, getTypeDef } from '@polkadot/types';
import { Dropdown } from '@polkadot/ui-app';
import { isObject } from '@polkadot/util';

import Bare from './Bare';

type Props = BaseProps;

type State = {
  options: Array<{ text: string, value: string }>,
  sub: Array<TypeDef>,
  type: string | null
};

export default class EnumParam extends React.PureComponent<Props, State> {
  state: State = {
    options: [],
    sub: [],
    type: null
  };

  static getDerivedStateFromProps ({ type: { type } }: Props, prevState: State) {
    if (prevState.type === type) {
      return null;
    }

    const sub = getTypeDef(createType(type).toRawType()).sub as Array<TypeDef>;
    const options = sub.map(({ name }) => ({
      text: name,
      value: name
    }));

    return {
      options,
      sub,
      type
    };
  }

  render () {
    const { className, defaultValue: { value }, isDisabled, isError, label, style, withLabel } = this.props;
    const { options } = this.state;
    const defaultValue = value && isObject(value)
      ? value instanceof Enum
        ? value.type
        : Object.keys(value)[0]
      : value;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Dropdown
          className={isDisabled ? 'full' : 'medium'}
          defaultValue={defaultValue}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          options={options}
          onChange={this.onChange}
          withEllipsis
          withLabel={withLabel}
        />
      </Bare>
    );
  }

  private onChange = (value: string): void => {
    const { onChange } = this.props;
    const { sub } = this.state;
    const def = sub.find(({ name }) => name === value);

    if (def && onChange) {
      onChange({
        isValid: true,
        value: { [value]: createType(def.type) }
      });
    }
  }
}
