// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/codec';
import { I18nProps } from '../types';
import { ComponentMap, RawParams, RawParam$OnChange, RawParam$OnChange$Value } from './types';

import './Params.css';

import React from 'react';

import classes from '../util/classes';
import translate from '../translate';
import Param from './Param';
import createValues from './values';

type Props = I18nProps & {
  isDisabled?: boolean,
  onChange?: (value: RawParams) => void,
  overrides?: ComponentMap,
  type: null | TypeDef,
  values?: RawParams
};

type State = {
  handlers: Array<RawParam$OnChange>,
  onChangeParam: (at: number, next: RawParam$OnChange$Value) => void,
  type: TypeDef,
  values: RawParams
};

class Params extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = ({
      onChangeParam: this.onChangeParam
    } as State);
  }

  // FIXME, FIXME
  // static getDerivedStateFromProps (props: Props, { type, onChangeParam }: State): State | null {
  //   const isSame = type && props.type && type.type === props.type.type;

  //   if (props.isDisabled || isSame) {
  //     return null;
  //   }

  //   const values = createValues(type);
  //   const handlers = values.map(
  //     (value, index): RawParam$OnChange =>
  //       (value: RawParam$OnChange$Value): void =>
  //         onChangeParam(index, value)
  //   );

  //   return {
  //     type: props.type,
  //     handlers,
  //     values
  //   } as State;
  // }

  //  // NOTE This is needed in the case where the item changes, i.e. the values get initialised and we need to alert the parent that we have new values
  // componentDidUpdate (prevProps: Props, prevState: State) {
  //   const { onChange, isDisabled } = this.props;
  //   const { values } = this.state;

  //   if (!isDisabled && prevState.values !== values) {
  //     onChange && onChange(values);
  //   }
  // }

  render () {
    const { className, isDisabled, type, overrides, style } = this.props;
    const { handlers = [], values = this.props.values } = this.state;

    return null;

    if (!type || !values || values.length === 0) {
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
              isDisabled={isDisabled}
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

  private onChangeParam = (at: number, { isValid = false, value }: RawParam$OnChange$Value): void => {
    const { isDisabled } = this.props;

    if (isDisabled) {
      return;
    }

    this.setState(
      (prevState: State): State => ({
        values: prevState.values.map((prev, index) =>
          index !== at
            ? prev
            : {
              isValid,
              type: prev.type,
              value
            }
        )
      } as State),
      this.triggerUpdate
    );
  }

  triggerUpdate = (): void => {
    const { values } = this.state;
    const { onChange, isDisabled } = this.props;

    if (isDisabled) {
      return;
    }

    onChange && onChange(values);
  }
}

// @ts-ignore something is wrong with generics and these imports
export default translate(Params);
