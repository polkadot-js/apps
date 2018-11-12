// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Props, RawParam } from '../types';

import React from 'react';

import Bare from './Bare';
import findComponent from './findComponent';

type State = {
  Components: Array<React.ComponentType<Props>>,
  sub: Array<string>,
  type?: string,
  values: Array<RawParam>
};

export default class Tuple extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      Components: [],
      sub: [],
      values: []
    };
  }

  static getDerivedStateFromProps ({ type }: Props, prevState: State) {
    if (type.type === prevState.type) {
      return null;
    }

    const sub = type.sub && Array.isArray(type.sub)
      ? type.sub
      : [];

    return {
      Components: sub.map((type) => findComponent(type)),
      sub: sub.map(({ type }) => type),
      type
    };
  }

  render () {
    const { className, defaultValue: { value = [] }, isDisabled, style, type, withLabel } = this.props;
    const { Components, sub } = this.state;

    const subTypes = Array.isArray(type.sub)
      ? type.sub
      : [];

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
