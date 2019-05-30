// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentMap, RawParams, RawParam$OnChange, RawParam$OnChange$Value } from './types';

import './Params.css';

import React from 'react';
import { classes } from '@polkadot/ui-app/util';
import translate from '@polkadot/ui-app/translate';

import Param from './Param';
import createValues from './values';

type Param = {
  name?: string,
  type: TypeDef
};

type Props = I18nProps & {
  isDisabled?: boolean,
  onChange?: (value: RawParams) => void,
  onEnter?: () => void,
  overrides?: ComponentMap,
  params: Array<Param>,
  values?: RawParams
};

type State = {
  handlers: Array<RawParam$OnChange>,
  onChangeParam: (at: number, next: RawParam$OnChange$Value) => void,
  params: Array<Param>,
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

  static getDerivedStateFromProps (props: Props, { params, onChangeParam }: State): State | null {
    const isSame = JSON.stringify(params) === JSON.stringify(props.params);

    if (props.isDisabled || isSame) {
      return null;
    }

    const values = createValues(props.params);
    const handlers = values.map(
      (_, index): RawParam$OnChange =>
        (value: RawParam$OnChange$Value): void =>
          onChangeParam(index, value)
    );

    return {
      handlers,
      params: props.params,
      values
    } as State;
  }

  // Fire the intial onChange (we did update) when the component is loaded
  componentDidMount () {
    this.componentDidUpdate({} as Props, {} as State);
  }

   // This is needed in the case where the item changes, i.e. the values get
   // initialised and we need to alert the parent that we have new values
  componentDidUpdate (_: Props, prevState: State) {
    const { onChange, isDisabled } = this.props;
    const { values } = this.state;

    if (!isDisabled && prevState.values !== values) {
      onChange && onChange(values);
    }
  }

  render () {
    const { className, isDisabled, onEnter, overrides, params, style } = this.props;
    const { handlers = [], values = this.props.values } = this.state;

    if (!params || params.length === 0 || !values || values.length === 0) {
      return null;
    }

    return (
      <div
        className={classes('ui--Params', className)}
        style={style}
      >
        <div className='ui--Params-Content'>
          {params.map(({ name, type }, index) => (
            <Param
              defaultValue={values[index]}
              isDisabled={isDisabled}
              key={`${name}:${name}:${index}`}
              name={name}
              onChange={handlers[index]}
              onEnter={onEnter}
              overrides={overrides}
              type={type}
            />
          ))}
        </div>
      </div>
    );
  }

  private onChangeParam = (at: number, newValue: RawParam$OnChange$Value): void => {
    const { isDisabled } = this.props;

    if (isDisabled) {
      return;
    }

    const { isValid = false, value } = newValue;

    this.setState(
      (prevState: State): State => ({
        values: prevState.values.map((prev, index) =>
          index !== at
            ? prev
            : {
              isValid,
              value
            }
        )
      } as State),
      this.triggerUpdate
    );
  }

  private triggerUpdate = (): void => {
    const { values } = this.state;
    const { onChange, isDisabled } = this.props;

    if (isDisabled) {
      return;
    }

    onChange && onChange(values);
  }
}

export default translate(Params);
