// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Codec, TypeDef } from '@polkadot/types/types';
import { Props, RawParam } from '../types';

import React from 'react';
import { isUndefined } from '@polkadot/util';

import Bare from './Bare';
import findComponent from './findComponent';

interface State {
  Components: React.ComponentType<Props>[];
  sub: string[];
  subTypes: TypeDef[];
  type?: string;
  values: RawParam[];
}

export default class Tuple extends React.PureComponent<Props, State> {
  public state: State = {
    Components: [],
    sub: [],
    subTypes: [],
    values: []
  };

  public static getDerivedStateFromProps ({ defaultValue: { value }, type: { sub, type } }: Props, prevState: State): Partial<State> | null {
    if (type === prevState.type) {
      return null;
    }

    const subTypes = sub && Array.isArray(sub)
      ? sub
      : [];
    const values = (value as any[]).map((value): { isValid: boolean; value: Codec } =>
      isUndefined(value) || isUndefined(value.isValid)
        ? {
          isValid: !isUndefined(value),
          value
        }
        : value
    );

    return {
      Components: subTypes.map((type): React.ComponentType<Props> => findComponent(type)),
      sub: subTypes.map(({ type }): string => type),
      subTypes,
      type,
      values
    };
  }

  public render (): React.ReactNode {
    const { className, isDisabled, onEnter, style, withLabel } = this.props;
    const { Components, sub, subTypes, values } = this.state;

    return (
      <Bare
        className={className}
        style={style}
      >
        {Components.map((Component, index): React.ReactNode => (
          <Component
            defaultValue={values[index] || {}}
            isDisabled={isDisabled}
            isOptional={false}
            key={index}
            label={sub[index]}
            onChange={this.onChange(index)}
            onEnter={onEnter}
            type={subTypes[index]}
            withLabel={withLabel}
          />
        ))}
      </Bare>
    );
  }

  private onChange = (index: number): (value: RawParam) => void => {
    return (value: RawParam): void => {
      this.setState(
        ({ values }: State): State => ({
          values: values.map((svalue, sindex): RawParam =>
            (sindex === index)
              ? value
              : svalue
          )
        } as unknown as State),
        (): void => {
          const { values } = this.state;
          const { onChange } = this.props;

          onChange && onChange({
            isValid: values.reduce((result: boolean, { isValid }): boolean => result && isValid, true),
            value: values.map(({ value }): any => value)
          });
        }
      );
    };
  }
}
