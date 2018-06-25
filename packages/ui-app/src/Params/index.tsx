// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Section$Item } from '@polkadot/params/types';
import { I18nProps } from '../types';
import { ComponentMap, RawParam, RawParams, RawParam$OnChange, RawParam$OnChange$Value } from './types';

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
  onChangeParam: (at: number, next: RawParam$OnChange$Value) => void,
  values: RawParams
};

class Params<T, SectionItem extends Section$Item<T>> extends React.PureComponent<Props<SectionItem>, State<SectionItem>> {
  state: State<SectionItem>;

  constructor (props: Props<SectionItem>) {
    super(props);

    this.state = ({
      onChangeParam: this.onChangeParam
    } as State<SectionItem>);
  }

  static getDerivedStateFromProps (props: Props<any>, { item, onChangeParam }: State<any>): State<any> | null {
    if (item && item.name === props.item.name && item.section === props.item.section) {
      return null;
    }

    const { params } = props.item;
    const values = createValues(params);
    const handlers = values.map(
      (value, index): RawParam$OnChange =>
        (value: RawParam$OnChange$Value): void =>
          onChangeParam(index, value)
    );

    return {
      item,
      handlers,
      values
    } as State<any>;
  }

  // FIXME Do we really need this one? The fact that we have to do deep inspection here just shows something is amis? We notify on param change below. Really cannot remember or see the actual real need here - apart from making things more complicated than they should be. (But there must be a reason)
  componentDidUpdate (prevProps: Props<SectionItem>, prevState: State<SectionItem>) {
    const { onChange } = this.props;
    const { values } = this.state;

    if (JSON.stringify(prevState.values) !== JSON.stringify(values)) {
      onChange(values);
    }
  }

  render () {
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

  onChangeParam = (at: number, { isValid = false, value }: RawParam$OnChange$Value): void => {
    this.setState(
      (prevState: State<SectionItem>): State<SectionItem> => ({
        values: prevState.values.map((prev, index) =>
          index !== at
            ? prev
            : {
              isValid,
              type: prev.type,
              value
            }
        )
      }) as State<SectionItem>,
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
