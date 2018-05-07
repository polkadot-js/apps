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

type State = {
  extrinsic: Extrinsic,
  values: Array<RawParam>
};

class Params extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    // wed ont' set anything, getDerivedStateFromProps will update
    this.state = ({}: $Shape<State>);
  }

  static getDerivedStateFromProps ({ extrinsic, onChange }: Props, { extrinsic: { name, section } = {} }: State): $Shape<State> | null {
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

  onChangeParam = (at: number, next: RawParam): void => {
    this.setState(
      (prevState: State): $Shape<State> => ({
        values: prevState.values.map((value, index) =>
          index === at
            ? next
            : value
        )
      }),
      (): void => {
        const { onChange } = this.props;
        const { values } = this.state;

        onChange(values);
      }
    );
  }
}

export default translate(Params);
