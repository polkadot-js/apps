// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Struct, TypeDef, createType, getTypeDef } from '@polkadot/types';
import { Props, RawParam } from '../types';

import React from 'react';
import { isUndefined } from '@polkadot/util';

import Bare from './Bare';
import findComponent from './findComponent';

type State = {
  Components: Array<React.ComponentType<Props>>,
  keys: Array<string>,
  sub: Array<string>,
  subTypes: Array<TypeDef>,
  type?: string,
  values: Array<RawParam>
};

export default class StructPaqram extends React.PureComponent<Props, State> {
  state: State = {
    Components: [],
    keys: [],
    sub: [],
    subTypes: [],
    values: []
  };

  static getDerivedStateFromProps ({ defaultValue: { value }, type: { type } }: Props, prevState: State): State | null {
    if (type === prevState.type) {
      return null;
    }

    const instance = createType(type) as Struct;
    const types = instance.Type;
    const subTypes = Object.values(types).map((type) => getTypeDef(type));
    const keys = Object.keys(value);
    const values = keys.map((key) => value[key]).map((value: any) =>
      isUndefined(value) || isUndefined(value.isValid)
        ? {
          isValid: !isUndefined(value),
          value
        }
        : value
    );

    return {
      Components: subTypes.map((type) => findComponent(type)),
      keys,
      sub: subTypes.map(({ type }) => type),
      subTypes,
      type,
      values
    };
  }

  render () {
    const { className, isDisabled, style, withLabel } = this.props;
    const { Components, keys, sub, subTypes, values } = this.state;

    console.error('struct');

    return (
      <Bare
        className={className}
        style={style}
      >
        {Components.map((Component, index) => (
          <Component
            defaultValue={values[index] || {}}
            isDisabled={isDisabled}
            key={index}
            label={`${keys[index]}: ${sub[index]}`}
            onChange={this.onChange(index)}
            type={subTypes[index]}
            withLabel={withLabel}
          />
        ))}
      </Bare>
    );
  }

  private onChange = (index: number) => {
    return (value: RawParam): void => {
      this.setState(
        ({ values }: State) => ({
          values: values.map((svalue, sindex) =>
            (sindex === index)
              ? value
              : svalue
        )}),
        () => {
          const { values } = this.state;
          const { onChange } = this.props;

          onChange && onChange({
            isValid: values.reduce((result, { isValid }) => result && isValid, true),
            value: values.map(({ value }) => value)
          });
        }
      );
    };
  }
}
