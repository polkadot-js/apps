// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentMap, ParamDef, RawParam, RawParams, RawParamOnChangeValue } from './types';

import React from 'react';
import styled from 'styled-components';
import { ErrorBoundary } from '@polkadot/react-components';
import { classes } from '@polkadot/react-components/util';

import ParamComp from './ParamComp';
import translate from './translate';
import { createValue } from './values';

interface Props extends I18nProps {
  isDisabled?: boolean;
  onChange?: (value: RawParams) => void;
  onEnter?: () => void;
  onError?: () => void;
  onEscape?: () => void;
  overrides?: ComponentMap;
  params: ParamDef[];
  values?: RawParams | null;
  withBorder?: boolean;
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
    const { className, isDisabled, onEnter, onEscape, overrides, params, style, withBorder = true } = this.props;
    const { values = this.props.values } = this.state;

    if (!values || !values.length) {
      return null;
    }

    return (
      <div
        className={classes('ui--Params', className, withBorder ? 'withBorder' : 'withoutBorder')}
        style={style}
      >
        <ErrorBoundary onError={this.onRenderError}>
          <div className='ui--Params-Content'>
            {values && params.map(({ name, type }: ParamDef, index: number): React.ReactNode => (
              <ParamComp
                defaultValue={values[index]}
                index={index}
                isDisabled={isDisabled}
                key={`${name}:${type}:${index}`}
                name={name}
                onChange={this.onChangeParam}
                onEnter={onEnter}
                onEscape={onEscape}
                overrides={overrides}
                type={type}
              />
            ))}
          </div>
        </ErrorBoundary>
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
    const { isDisabled, onChange } = this.props;
    const { values } = this.state;

    if (isDisabled || !values) {
      return;
    }

    onChange && onChange(values);
  }

  private onRenderError = (): void => {
    const { onError } = this.props;

    onError && onError();
  }
}

export default translate(
  styled(Params as React.ComponentClass<Props>)`
    &.withBorder {
      border-left: 0.25rem solid #f2f2f2;
    }

    &.withoutBorder {
      margin-left: -1.75rem;
      padding: 0;
    }

    .ui--Param .ui--Labelled label {
      text-transform: none !important;
      font-family: monospace;
    }

    .ui--row {
      flex-wrap: wrap;
    }

    .ui--Param-Address {
      font-family: monospace;
    }

    .ui--Params-Content {
      box-sizing: border-box;
      padding: 0 0 0 1.75rem;
    }

    .ui--Param-text {
      display: inline-block;
      font-size: 1rem;
      line-height: 1.714rem;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ui--Param-text .icon {
      margin-right: 0.5rem !important;
    }

    .ui--Param-text * {
      vertical-align: middle;
    }

    .ui--Param-text.nowrap {
      white-space: nowrap;
    }

    .ui--Param-text.name {
      color: rgba(0, 0, 0, .6);
      font-style: italic;
    }

    .ui--Param-text + .ui--Param-text {
      margin-left: 0.5rem;
    }

    .ui--Param-Vector-buttons {
      text-align: right;
    }

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
