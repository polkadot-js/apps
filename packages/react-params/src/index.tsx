// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { I18nProps } from '@polkadot/react-components/types';
import { ComponentMap, ParamDef, RawParam, RawParams, RawParamOnChangeValue } from './types';

import React from 'react';
import { ErrorBoundary } from '@polkadot/react-components';

import Holder from './Holder';
import ParamComp from './ParamComp';
import translate from './translate';
import { createValue } from './values';

interface Props extends I18nProps {
  children?: React.ReactNode;
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

export { Holder };

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
    const { children, className = '', isDisabled, onEnter, onEscape, overrides, params, withBorder = true } = this.props;
    const { values = this.props.values } = this.state;

    if (!values || !values.length) {
      return null;
    }

    return (
      <Holder
        className={className}
        withBorder={withBorder}
      >
        <ErrorBoundary onError={this.onRenderError}>
          <div className='ui--Params-Content'>
            {values && params.map(({ name, type }: ParamDef, index: number): React.ReactNode => (
              <ParamComp
                defaultValue={values[index]}
                index={index}
                isDisabled={isDisabled}
                key={`${name || ''}:${type.toString()}:${index}`}
                name={name}
                onChange={this.onChangeParam}
                onEnter={onEnter}
                onEscape={onEscape}
                overrides={overrides}
                type={type}
              />
            ))}
          </div>
          {children}
        </ErrorBoundary>
      </Holder>
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

export default translate(Params);
