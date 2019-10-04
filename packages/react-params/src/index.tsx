// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentMap, ParamDef, RawParam, RawParams, RawParamOnChange, RawParamOnChangeValue } from './types';

import './Params.css';

import React from 'react';
import styled from 'styled-components';
import { classes } from '@polkadot/react-components/util';

import Param from './Param';
import translate from './translate';
import { createValue } from './values';

interface Props extends I18nProps {
  isDisabled?: boolean;
  onChange?: (value: RawParams) => void;
  onEnter?: () => void;
  overrides?: ComponentMap;
  params: ParamDef[];
  values?: RawParams | null;
}

interface State {
  handlersChange?: RawParamOnChange[];
  onChangeParam: (at: number, next: RawParamOnChangeValue) => void;
  params?: ParamDef[];
  values?: RawParams;
}

class Params extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      onChangeParam: this.onChangeParam
    };
  }

  public static getDerivedStateFromProps ({ isDisabled, params, values }: Props, prevState: State): Pick<State, never> | null {
    const isSame = JSON.stringify(prevState.params) === JSON.stringify(params);

    if (isDisabled || isSame) {
      return null;
    }

    const newValues = params.reduce(
      (result: RawParams, param, index): RawParams => [
        ...result,
        values && values[index]
          ? values[index]
          : createValue(param)
      ],
      []
    );

    const handlersChange = newValues.map(
      (_, index): RawParamOnChange =>
        (value: RawParamOnChangeValue): void =>
          prevState.onChangeParam(index, value)
    );

    return {
      handlersChange,
      params,
      values: newValues
    };
  }

  // Fire the intial onChange (we did update) when the component is loaded
  public componentDidMount (): void {
    this.componentDidUpdate({} as unknown as Props, {} as unknown as State);
  }

  // This is needed in the case where the item changes, i.e. the values get
  // initialised and we need to alert the parent that we have new values
  public componentDidUpdate (_: Props, prevState: State): void {
    const { isDisabled } = this.props;
    const { values } = this.state;

    if (!isDisabled && prevState.values !== values) {
      this.triggerUpdate();
    }
  }

  public render (): React.ReactNode {
    const { className, isDisabled, onEnter, overrides, params, style } = this.props;
    const { handlersChange = [], values = this.props.values } = this.state;

    if (!params || params.length === 0) {
      return null;
    }

    return (
      <div
        className={classes('ui--Params', className)}
        style={style}
      >
        <div className='ui--Params-Content'>
          {params.map(({ name, type }: ParamDef, index: number): React.ReactNode => {
            if (!values || values.length === 0) {
              return null;
            }

            const key = `${name}:${type}:${index}`;

            return (
              <div
                className='ui--Param-composite'
                key={key}
              >
                <Param
                  defaultValue={values[index]}
                  isDisabled={isDisabled}
                  key={`input:${key}`}
                  name={name}
                  onChange={handlersChange[index]}
                  onEnter={onEnter}
                  overrides={overrides}
                  type={type}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private extractValues (): RawParam[] {
    const { values } = this.state;
    const { isDisabled } = this.props;

    if (isDisabled || !values) {
      return [];
    }

    return values;
  }

  private onChangeParam = (at: number, newValue: RawParamOnChangeValue): void => {
    const { isDisabled } = this.props;

    if (isDisabled) {
      return;
    }

    const { isValid = false, value } = newValue;

    this.setState(
      (prevState: State): Pick<State, never> => ({
        values: (prevState.values || []).map((prev, index): RawParam =>
          index !== at
            ? prev
            : { isValid, value }
        )
      }),
      this.triggerUpdate
    );
  }

  private triggerUpdate = (): void => {
    const { values } = this.state;
    const { onChange, isDisabled } = this.props;

    if (isDisabled || !values) {
      return;
    }

    onChange && onChange(this.extractValues());
  }
}

export default translate(
  styled(Params as React.ComponentClass<Props>)`
    .ui--Param-composite {
      position: relative;

      .ui--Param-overlay {
        position: absolute;
        top: 0.5rem;
        right: 3.5rem;
      }
    }
  `
);
