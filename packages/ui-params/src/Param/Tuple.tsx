// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/codec';
import { Props, RawParam } from '../types';

import React from 'react';
import { isUndefined } from '@polkadot/util';

import Bare from './Bare';
import findComponent from './findComponent';

type State = {
  Components: Array<React.ComponentType<Props>>,
  sub: Array<string>,
  subTypes: Array<TypeDef>,
  type?: string,
  values: Array<RawParam>
};

export default class Tuple extends React.PureComponent<Props, State> {
  state: State = {
    Components: [],
    sub: [],
    subTypes: [],
    values: []
  };

  static getDerivedStateFromProps ({ defaultValue: { value }, type: { sub, type } }: Props, prevState: State): Partial<State> | null {
    if (type === prevState.type) {
      return null;
    }

    const subTypes = sub && Array.isArray(sub)
      ? sub
      : [];
    const values = (value as Array<any>).map((value) =>
      isUndefined(value) || isUndefined(value.isValid)
        ? {
          isValid: !isUndefined(value),
          value
        }
        : value
    );

    return {
      Components: subTypes.map((type) => findComponent(type)),
      sub: subTypes.map(({ type }) => type),
      subTypes,
      type,
      values
    };
  }

  render () {
    const { className, isDisabled, style, withLabel } = this.props;
    const { Components, sub, subTypes, values } = this.state;

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
            label={sub[index]}
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
