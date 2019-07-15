// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentMap, RawParam, RawParams, RawParamOnChange, RawParamOnChangeValue } from './types';

import './Params.css';

import React from 'react';
import { classes } from '@polkadot/ui-app/util';
import translate from '@polkadot/ui-app/translate';

import Param from './Param';
import createValues from './values';

interface Param {
  name?: string;
  type: TypeDef;
}

interface Props extends I18nProps {
  isDisabled?: boolean;
  onChange?: (value: RawParams) => void;
  onEnter?: () => void;
  overrides?: ComponentMap;
  params: Param[];
  values?: RawParams;
}

interface State {
  handlers?: RawParamOnChange[];
  onChangeParam: (at: number, next: RawParamOnChangeValue) => void;
  params?: Param[];
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

  public static getDerivedStateFromProps (props: Props, { params, onChangeParam }: State): State | null {
    const isSame = JSON.stringify(params) === JSON.stringify(props.params);

    if (props.isDisabled || isSame) {
      return null;
    }

    const values = createValues(props.params);
    const handlers = values.map(
      (_, index): RawParamOnChange =>
        (value: RawParamOnChangeValue): void =>
          onChangeParam(index, value)
    );

    return {
      handlers,
      onChangeParam,
      params: props.params,
      values
    };
  }

  // Fire the intial onChange (we did update) when the component is loaded
  public componentDidMount (): void {
    this.componentDidUpdate({} as unknown as Props, {} as unknown as State);
  }

  // This is needed in the case where the item changes, i.e. the values get
  // initialised and we need to alert the parent that we have new values
  public componentDidUpdate (_: Props, prevState: State): void {
    const { onChange, isDisabled } = this.props;
    const { values } = this.state;

    if (!isDisabled && prevState.values !== values) {
      onChange && onChange(values || []);
    }
  }

  public render (): React.ReactNode {
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
          {params.map(({ name, type }, index): React.ReactNode => (
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

  private onChangeParam = (at: number, newValue: RawParamOnChangeValue): void => {
    const { isDisabled } = this.props;

    if (isDisabled) {
      return;
    }

    const { isValid = false, value } = newValue;

    this.setState(
      (prevState: State): State => ({
        values: (prevState.values || []).map((prev, index): RawParam =>
          index !== at
            ? prev
            : {
              isValid,
              value
            }
        )
      } as unknown as State),
      this.triggerUpdate
    );
  }

  private triggerUpdate = (): void => {
    const { values } = this.state;
    const { onChange, isDisabled } = this.props;

    if (isDisabled || !values) {
      return;
    }

    onChange && onChange(values);
  }
}

export default translate(Params);
