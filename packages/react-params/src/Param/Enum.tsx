// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { Props, RawParam } from '../types';

import React from 'react';
import { Enum, createType, getTypeDef } from '@polkadot/types';
import { Dropdown } from '@polkadot/react-components';

import Params from '../';
import Bare from './Bare';
import Static from './Static';

interface Option {
  text?: string;
  value?: string;
}

interface State {
  def: TypeDef | null;
  options: Option[];
  sub: TypeDef[];
  type: string | null;
}

export default class EnumParam extends React.PureComponent<Props, State> {
  public state: State = {
    def: null,
    options: [],
    sub: [],
    type: null
  };

  public static getDerivedStateFromProps ({ type: { type } }: Props, prevState: State): State | null {
    if (prevState.type === type) {
      return null;
    }

    const rawType = createType(type as any).toRawType();
    const typeDef = getTypeDef(rawType);

    // HACK This is a quick hack to allow `Option<struct>` ... this is certainly not the right
    // place for this, so we need to move it (even the detection just sucks)... also see struct
    const sub = typeDef.type.startsWith('Option<')
      ? (typeDef.sub as TypeDef).sub as TypeDef[]
      : typeDef.sub as TypeDef[];

    return {
      def: prevState.def || sub[0],
      options: sub.map(({ name }): Option => ({
        text: name,
        value: name
      })),
      sub,
      type
    };
  }

  public render (): React.ReactNode {
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
          className='full'
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
    this.setState(({ sub }): Pick<State, never> => ({
      def: sub.find(({ name }): boolean => name === value) || null
    }));
  }

  private onChangeParam = ([{ isValid, value }]: RawParam[]): void => {
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
