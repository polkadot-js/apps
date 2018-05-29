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

type Props<SectionItem> = I18nProps & {
  item: SectionItem,
  onChange: (value: RawParams) => void,
  overrides?: ComponentMap
};

type State<SectionItem> = {
  item: SectionItem,
  handlers: Array<RawParam$OnChange>,
  onChangeParam: (at: number, next: RawParam) => void,
  values: RawParams
};

class Params<T, SectionItem: Section$Item<T>> extends React.PureComponent<Props<SectionItem>, State<SectionItem>> {
  state: State<SectionItem>;

  constructor (props: Props<SectionItem>) {
    super(props);

    this.state = ({
      onChangeParam: this.onChangeParam
    }: $Shape<State<SectionItem>>);
  }

  static getDerivedStateFromProps ({ item }: Props<SectionItem>, { item: { name, section } = {}, onChangeParam }: State<SectionItem>): $Shape<State<SectionItem>> | null {
    if (name === item.name && section === item.section) {
      return null;
    }

    const { params } = item;
    const values = createValues(params);
    const handlers = values.map(
      (value, index): RawParam$OnChange =>
        (value: RawParam): void =>
          onChangeParam(index, value)
    );

    return {
      item,
      handlers,
      values
    };
  }

  componentDidUpdate (prevProps: Props<SectionItem>, prevState: State<SectionItem>) {
    const { onChange } = this.props;
    const { values } = this.state;

    if (prevState.values !== values) {
      onChange(values);
    }
  }

  render (): React$Node {
    const { className, item: { params }, overrides, style } = this.props;
    const { handlers, values } = this.state;

    if (values.length === 0 || params.length === 0) {
      return null;
    }

    return (
      <div
        className={classes('ui--Params', className)}
        style={style}
      >
        <div className='ui--Params-Content'>
          {params.map(({ name }, index) => (
            <Param
              defaultValue={values[index]}
              key={`${name}:${name}:${index}`}
              name={name}
              onChange={handlers[index]}
              overrides={overrides}
            />
          ))}
        </div>
      </div>
    );
  }

  onChangeParam = (at: number, { isValid = false, value }: RawParam): void => {
    this.setState(
      (prevState: State<SectionItem>): $Shape<State<SectionItem>> => ({
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
