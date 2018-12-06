// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/codec';
import { Props, RawParam } from '../types';

import React from 'react';

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
  constructor (props: Props) {
    super(props);

    this.state = {
      Components: [],
      sub: [],
      subTypes: [],
      values: []
    };
  }

  static getDerivedStateFromProps ({ type: { sub, type } }: Props, prevState: State): Partial<State> | null {
    if (type === prevState.type) {
      return null;
    }

    const subTypes = sub && Array.isArray(sub)
      ? sub
      : [];

    return {
      Components: subTypes.map((type) => findComponent(type)),
      sub: subTypes.map(({ type }) => type),
      subTypes,
      type
    };
  }

  render () {
    const { className, defaultValue: { value = [] }, isDisabled, style, withLabel } = this.props;
    const { Components, sub, subTypes } = this.state;

    return (
      <Bare
        className={className}
        style={style}
      >
        {Components.map((Component, index) => (
          <Component
            defaultValue={value[index] || {}}
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
    const { onChange } = this.props;

    return (value: RawParam): void => {
      let isValid = value.isValid;
      const values = this.state.values.map((svalue, sindex) => {
        if (sindex === index) {
          return value;
        }

        isValid = isValid && svalue.isValid;

        return svalue;
      });

      this.setState({ values }, () => {
        onChange && onChange({
          isValid,
          value: values.map(({ value }) => value)
        });
      });
    };
  }
}
