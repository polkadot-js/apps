// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BaseProps, RawParam } from '../types';

import React from 'react';
import { Enum, TypeDef, createType, getTypeDef } from '@polkadot/types';
import { Dropdown } from '@polkadot/ui-app';

import Params from '../';
import Bare from './Bare';
import Static from './Static';

type Props = BaseProps;

type State = {
  def: TypeDef | null,
  options: Array<{ text: string, value: string }>,
  sub: Array<TypeDef>,
  type: string | null
};

export default class EnumParam extends React.PureComponent<Props, State> {
  state: State = {
    def: null,
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
    const def = prevState.def || sub[0];

    return {
      def,
      options,
      sub,
      type
    } as State;
  }

  render () {
    const { className, defaultValue, isDisabled, isError, label, style, withLabel } = this.props;

    if (isDisabled) {
      return <Static {...this.props} />;
    }

    const { def, options } = this.state;
    const initialValue = defaultValue && defaultValue.value
      ? defaultValue.value instanceof Enum
        ? defaultValue.value.type
        : Object.keys(defaultValue.value)[0]
      : defaultValue;

    return (
      <Bare
        className={className}
        style={style}
      >
        <Dropdown
          className='large'
          defaultValue={initialValue}
          isDisabled={isDisabled}
          isError={isError}
          label={label}
          options={options}
          onChange={this.onChange}
          withEllipsis
          withLabel={withLabel}
        />
        {def && (
          <Params
            onChange={this.onChangeParam}
            params={[{ name: def.name, type: def }]}
          />
        )}
      </Bare>
    );
  }

  private onChange = (value: string): void => {
    const { sub } = this.state;

    this.setState({
      def: sub.find(({ name }) => name === value) || null
    });
  }

  private onChangeParam = ([{ isValid, value }]: Array<RawParam>): void => {
    const { onChange } = this.props;
    const { def } = this.state;

    if (def) {
      onChange && onChange({
        isValid,
        value: {
          [def.name as string]: value
        }
      });
    }
  }
}
