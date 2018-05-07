// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';
import type { ComponentMap, RawParam } from './types';

import './Params.css';

import React from 'react';

import translate from '../translate';
import Param from './Param';
import createValues from './values';

type RawParams = Array<RawParam>;

type Props = I18nProps & {
  extrinsic: Extrinsic,
  onChange: (value: RawParams) => void,
  overrides?: ComponentMap
};

type StateT = {
  extrinsic: Extrinsic,
  values: Array<RawParam>
};

class Params extends React.PureComponent<Props, StateT> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {};
  }

  static getDerivedStateFromProps ({ extrinsic, onChange }: Props, { extrinsic: { name, section } = {} }: StateT): $Shape<StateT> | null {
    if (name === extrinsic.name && section === extrinsic.section) {
      return null;
    }

    const { params = {} } = extrinsic;
    const values = createValues(params);

    onChange(values);

    return {
      extrinsic,
      values: createValues(params)
    };
  }

  render (): React$Node {
    const { className, overrides, style, extrinsic } = this.props;
    const { values } = this.state;

    if (!values.length) {
      return null;
    }

    const { name, params = {} } = extrinsic;
    const paramNames = Object.keys(params);

    if (paramNames.length === 0) {
      return null;
    }

    return (
      <div
        className={['ui--Params', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='ui--Params-Content'>
          {paramNames.map((paramName, index) => {
            const { options, type } = params[paramName];

            return (
              <Param
                index={index}
                key={`${name}:${paramName}:${index}`}
                onChange={this.onChangeParam}
                overrides={overrides}
                value={{
                  name: paramName,
                  options,
                  type
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  onUpdate = (): void => {
    const { onChange } = this.props;
    const { values } = this.state;

    onChange(values);
  }

  onChangeParam = (at: number, next: RawParam): void => {
    this.setState(
      ({ values }: State): $Shape<State> => ({
        values: values.map((value, index) =>
          index === at
            ? next
            : value
        )
      }),
      this.onUpdate
    );
  }
}

export default translate(Params);
