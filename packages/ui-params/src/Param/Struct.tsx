// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props as BaseProps, RawParam } from '../types';

import React from 'react';
import { TypeDef, createType, getTypeDef } from '@polkadot/types';

import Params from '../';
import Base from './Base';
import Static from './Static';

type Props = BaseProps;

type State = {
  defs: Array<TypeDef>,
  type: string | null
};

export default class StructParam extends React.PureComponent<Props, State> {
  state: State = {
    defs: [],
    type: null
  };

  static getDerivedStateFromProps ({ type: { type } }: Props, prevState: State) {
    if (prevState.type === type) {
      return null;
    }

    const defs = getTypeDef(createType(type).toRawType()).sub as Array<TypeDef>;

    return {
      defs,
      type
    } as State;
  }

  render () {
    const { className, isDisabled, label, style, withLabel } = this.props;

    if (isDisabled) {
      return <Static {...this.props} />;
    }

    const { defs } = this.state;
    const params = defs.map((type) => ({ name: type.name, type }));

    return (
      <div>
        <Base
          className={className}
          label={label}
          size='full'
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

  private onChangeParams = (values: Array<RawParam>) => {
    const { onChange } = this.props;

    if (onChange) {
      const { defs } = this.state;

      onChange({
        isValid: values.reduce((result, { isValid }) => result && isValid, true as boolean),
        value: defs.reduce((value, { name }, index) => {
          value[name as string] = values[index].value;

          return value;
        }, {} as { [index: string]: any })
      });
    }
  }
}
