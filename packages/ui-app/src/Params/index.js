// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Section$Item } from '@polkadot/params/types';
import type { I18nProps } from '../types';
import type { ComponentMap, RawParam, RawParams, RawParam$OnChange } from './types';

import './Params.css';

import React from 'react';

import classes from '../util/classes';
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
  handlers: Array<RawParam$OnChange>,
  onChangeParam: (at: number, next: RawParam) => void,
  values: RawParams
};

class Params extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = ({
      onChangeParam: this.onChangeParam
    }: $Shape<State>);
  }

  static getDerivedStateFromProps ({ item, onChange }: Props, { item: { name, section } = {}, onChangeParam }: State): $Shape<State> | null {
    if (name === item.name && section === item.section) {
      return null;
    }

    const { params = {} } = item;
    const values = createValues(params);
    const handlers = values.map(
      (value, index): RawParam$OnChange =>
        (value: RawParam): void =>
          onChangeParam(index, value)
    );

    onChange(values);

    return {
      item,
      handlers,
      values
    };
  }

  render (): React$Node {
    const { className, item: { name, params = {} }, overrides, style } = this.props;
    const { handlers, values } = this.state;
    const paramNames = Object.keys(params);

    if (values.length === 0 || paramNames.length === 0) {
      return null;
    }

    return (
      <div
        className={classes('ui--Params', className)}
        style={style}
      >
        <div className='ui--Params-Content'>
          {paramNames.map((paramName, index) => (
            <Param
              defaultValue={values[index]}
              index={index}
              key={`${name}:${paramName}:${index}`}
              name={paramName}
              onChange={handlers[index]}
              overrides={overrides}
              type={params[paramName].type}
            />
          ))}
        </div>
      </div>
    );
  }

  onChangeParam = (at: number, { isValid = false, value }: RawParam): void => {
    this.setState(
      (prevState: State): $Shape<State> => ({
        values: prevState.values.map((prev, index) =>
          index !== at
            ? prev
            : {
              isValid,
              type: prev.type,
              value
            }
        )
      }),
      this.notifyChange
    );
  }

  notifyChange = (): void => {
    const { onChange } = this.props;
    const { values } = this.state;

    onChange(values);
  }
}

export default translate(Params);
