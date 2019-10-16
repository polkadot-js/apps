// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentMap, ParamDef, RawParam, RawParams, RawParamOnChangeValue } from './types';

import './Params.css';

import React from 'react';
import styled from 'styled-components';
import { classes } from '@polkadot/react-components/util';

import ParamComp from './ParamComp';
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
  params?: ParamDef[] | null;
  values?: RawParams;
}

class Params extends React.PureComponent<Props, State> {
  public state: State = {
    params: null
  };

  public static getDerivedStateFromProps ({ isDisabled, params, values }: Props, prevState: State): Pick<State, never> | null {
    const isSame = JSON.stringify(prevState.params) === JSON.stringify(params);

    if (isDisabled || isSame) {
      return null;
    }

    return {
      params,
      values: params.reduce(
        (result: RawParams, param, index): RawParams => [
          ...result,
          values && values[index]
            ? values[index]
            : createValue(param)
        ],
        []
      )
    };
  }

  // Fire the initial onChange (we did update) when the component is loaded
  public componentDidMount (): void {
    this.componentDidUpdate(null, {});
  }

  // This is needed in the case where the item changes, i.e. the values get
  // initialized and we need to alert the parent that we have new values
  public componentDidUpdate (_: Props | null, prevState: State): void {
    const { isDisabled } = this.props;
    const { values } = this.state;

    if (!isDisabled && JSON.stringify(prevState.values) !== JSON.stringify(values)) {
      this.triggerUpdate();
    }
  }

  public render (): React.ReactNode {
    const { className, isDisabled, overrides, params, style } = this.props;
    const { values = this.props.values } = this.state;

    if (!values || !values.length) {
      return null;
    }

    return (
      <div
        className={classes('ui--Params', className)}
        style={style}
      >
        <div className='ui--Params-Content'>
          {values && params.map(({ name, type }: ParamDef, index: number): React.ReactNode => (
            <ParamComp
              defaultValue={values[index]}
              index={index}
              isDisabled={isDisabled}
              key={`${name}:${type}:${index}`}
              name={name}
              onChange={this.onChangeParam}
              overrides={overrides}
              type={type}
            />
          ))}
        </div>
      </div>
    );
  }

  private onChangeParam = (index: number, newValue: RawParamOnChangeValue): void => {
    const { isDisabled } = this.props;

    if (isDisabled) {
      return;
    }

    const { isValid = false, value } = newValue;

    this.setState(
      (prevState: State): Pick<State, never> => ({
        values: (prevState.values || []).map((prev, prevIndex): RawParam =>
          prevIndex !== index
            ? prev
            : { isValid, value }
        )
      }),
      this.triggerUpdate
    );
  }

  private triggerUpdate = (): void => {
    const { onChange, isDisabled } = this.props;
    const { values } = this.state;

    if (isDisabled || !values) {
      return;
    }

    onChange && onChange(values);
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
