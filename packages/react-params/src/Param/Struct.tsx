// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { Props, RawParam } from '../types';

import React from 'react';
import { createType, getTypeDef } from '@polkadot/types';

import Params from '../';
import Base from './Base';
import Static from './Static';

interface State {
  defs: TypeDef[];
  type: string | null;
}

export default class StructParam extends React.PureComponent<Props, State> {
  public state: State = {
    defs: [],
    type: null
  };

  public static getDerivedStateFromProps ({ type: { type } }: Props, prevState: State): State | null {
    if (prevState.type === type) {
      return null;
    }

    const defs = getTypeDef(createType(type as any).toRawType()).sub as TypeDef[];

    return {
      defs,
      type
    } as unknown as State;
  }

  public render (): React.ReactNode {
    const { className, isDisabled, label, style, withLabel } = this.props;

    if (isDisabled) {
      return <Static {...this.props} />;
    }

    const { defs } = this.state;
    const params = defs.map((type): { name?: string; type: TypeDef } => ({ name: type.name, type }));

    return (
      <div>
        <Base
          className={className}
          label={label}
          style={style}
          withLabel={withLabel}
        >
          &nbsp;
        </Base>
        <Params
          onChange={this.onChangeParams}
          params={params}
        />
      </div>
    );
  }

  private onChangeParams = (values: RawParam[]): void => {
    const { onChange } = this.props;

    if (onChange) {
      const { defs } = this.state;

      onChange({
        isValid: values.reduce((result, { isValid }): boolean => result && isValid, true as boolean),
        value: defs.reduce((value, { name }, index): Record<string, any> => {
          value[name as string] = values[index].value;

          return value;
        }, {} as unknown as Record<string, any>)
      });
    }
  }
}
