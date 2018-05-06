// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';
import type { ComponentMap, RawParam } from './types';

import './Params.css';

import React from 'react';

import doChange from '../util/doChange';
import translate from '../translate';
import Param from './Param';
import createValues from './values';

type RawParams = Array<RawParam>;

type Props = I18nProps & {
  onChange: (value: RawParams) => void | rxjs$BehaviorSubject<RawParams>,
  overrides?: ComponentMap,
  value: Extrinsic;
};

type State = {
  values: Array<RawParam>
};

class Params extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      values: []
    };
  }

  static getDerivedStateFromProps (props: Props, prevState: State): $Shape<State> | null {
    const { onChange, value: { params = {} } = {} } = props;
    const values = createValues(params);

    onChange(values, onChange);

    return {
      values
    };
  }

  onChangeParam = (index: number, next: RawParam): void => {
    const { onChange } = this.props;
    const values = this.state.values.map((value, _index) =>
      index === _index
        ? next
        : value
    );

    this.setState({ values }, () =>
      doChange(values, onChange)
    );
  }

  render (): React$Node {
    const { className, overrides, style, value } = this.props;
    const { subjects } = this.state;

    if (!value || !subjects.length) {
      return null;
    }

    const { name, params = {} } = value;
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
}

export default translate(Params);
