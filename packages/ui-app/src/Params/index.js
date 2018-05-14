// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Section$Item } from '@polkadot/params/types';
import type { I18nProps } from '../types';
import type { ComponentMap, RawParam, RawParams } from './types';

import './Params.css';

import React from 'react';

import translate from '../translate';
import Param from './Param';
import createValues from './values';

type Props = I18nProps & {
  item: Section$Item,
  onChange: (value: RawParams) => void,
  overrides?: ComponentMap
};

type State = {
  item: Section$Item,
  values: RawParams
};

class Params extends React.PureComponent<Props, State> {
  state: State = ({}: $Shape<State>);

  static getDerivedStateFromProps ({ item, onChange }: Props, { item: { name, section } = {} }: State): $Shape<State> | null {
    if (name === item.name && section === item.section) {
      return null;
    }

    const { params = {} } = item;
    const values = createValues(params);

    onChange(values);

    return {
      item,
      values: createValues(params)
    };
  }

  render (): React$Node {
    const { className, item, overrides, style } = this.props;
    const { values } = this.state;

    if (!values.length) {
      return null;
    }

    const { name, params = {} } = item;
    const paramNames = Object.keys(params);

    if (paramNames.length === 0) {
      return null;
    }

    return (
      <div
        className={['ui--Params', className].join(' ')}
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
