// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, Compact, Moment, Struct, TypeDef, TypeDefInfo, createType, getTypeDef, u32, u64 } from '@polkadot/types';
import { Props, RawParam } from '../types';

import React from 'react';
import { isUndefined } from '@polkadot/util';

import Bare from './Bare';
import findComponent from '../findComponent';

type State = {
  Components: Array<React.ComponentType<Props>>,
  keys: Array<string>,
  sub: Array<string>,
  subTypes: Array<TypeDef>,
  type?: string,
  values: Array<RawParam>
};

function createStructDef (struct: Struct, { name, type, sub }: TypeDef): TypeDef {
  const defSub: Array<TypeDef> = (sub as Array<TypeDef>) || [];
  const def: TypeDef = {
    info: TypeDefInfo.Struct,
    name,
    type,
    sub: defSub
  };

  const types = struct.Type;

  [...struct.entries()].forEach(([key, value], index) => {
    defSub[index] = defSub[index] || {
      info: TypeDefInfo.Plain,
      name: key,
      type: types[index]
    };

    if (value instanceof Compact) {
      const inner = (struct.get(key) as Compact).unwrap();

      defSub[index].info = TypeDefInfo.Compact;
      defSub[index].sub = {
        info: TypeDefInfo.Plain,
        type: inner instanceof Balance
          ? 'Balance'
          : (
            inner instanceof Moment
              ? 'Moment'
              : (
                inner instanceof u32
                  ? 'u32'
                  : (
                    inner instanceof u64
                      ? 'u64'
                      : 'u128'
                  )
              )
          )
      };
      defSub[index].type = `Compact<${(defSub[index].sub as TypeDef).type}>`;
    }
  });

  return def;
}

export default class StructComponent extends React.PureComponent<Props, State> {
  state: State = {
    Components: [],
    keys: [],
    sub: [],
    subTypes: [],
    values: []
  };

  static getDerivedStateFromProps ({ defaultValue: { value }, type }: Props, prevState: State): State | null {
    if (type.type === prevState.type) {
      return null;
    }

    const struct = createType(type.type) as Struct;
    const typeCalc = createStructDef(struct, type);
    const subTypes = (typeCalc.sub as Array<TypeDef>);
    const keys = [...struct.keys()] as Array<string>;
    const isStruct = value instanceof Struct;
    const values = keys
      .map((key) => isStruct ? value.get(key) : value[key])
      .map((value: any) =>
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
      type: type.type,
      values
    };
  }

  render () {
    const { className, isDisabled, style, withLabel } = this.props;
    const { Components, keys, sub, subTypes, values } = this.state;

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
