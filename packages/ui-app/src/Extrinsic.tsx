// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MethodFunction } from '@polkadot/types/primitive/Method';
import { BareProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { RawParam } from '@polkadot/ui-params/types';

import React from 'react';
import { Method, TypeDef, getTypeDef } from '@polkadot/types';

import { InputExtrinsic } from '@polkadot/ui-app';
import Params from '@polkadot/ui-params';
import { withApi } from '@polkadot/ui-api';
import { isUndefined } from '@polkadot/util';

import paramComponents from './Params';

type Props = BareProps & ApiProps & {
  defaultValue: MethodFunction,
  isDisabled?: boolean,
  isError?: boolean,
  isPrivate?: boolean,
  label?: React.ReactNode,
  onChange: (method?: Method) => void,
  onEnter: () => void,
  withLabel?: boolean
};

type State = {
  methodfn: MethodFunction,
  params: Array<{ name: string, type: TypeDef }>,
  values: Array<RawParam>
};

class ExtrinsicDisplay extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      methodfn: props.defaultValue,
      params: this.getParams(props.defaultValue),
      values: []
    };
  }

  render () {
    const { defaultValue, isDisabled, isError, isPrivate, label, onEnter, withLabel } = this.props;
    const { methodfn: { method, section, meta }, params } = this.state;

    return (
      <div className='extrinsics--Extrinsic'>
        <InputExtrinsic
          defaultValue={defaultValue}
          isDisabled={isDisabled}
          isError={isError}
          isPrivate={isPrivate}
          label={label}
          onChange={this.onChangeMethod}
          withLabel={withLabel}
          help={meta && meta.documentation && meta.documentation.join(' ')}
        />
        <Params
          key={`${section}.${method}:params` /* force re-render on change */}
          onChange={this.onChangeValues}
          onEnter={onEnter}
          overrides={paramComponents}
          params={params}
        />
      </div>
    );
  }

  private nextState (newState: State): void {
    this.setState(newState, () => {
      const { onChange } = this.props;
      const { methodfn, params, values } = this.state;

      const isValid = values.reduce((isValid, value) =>
        isValid &&
        !isUndefined(value) &&
        !isUndefined(value.value) &&
        value.isValid, params.length === values.length
      );

      let method;

      if (isValid) {
        try {
          method = methodfn(
            ...values.map(({ value }) => value)
          );
        } catch (error) {
          // swallow
        }
      }

      onChange(method);
    });
  }

  private onChangeMethod = (methodfn: MethodFunction): void => {
    this.nextState({
      methodfn,
      params: this.getParams(methodfn),
      values: []
    });
  }

  private onChangeValues = (values: Array<RawParam>): void => {
    this.nextState({ values } as State);
  }

  private getParams (methodfn: MethodFunction): Array<{ name: string, type: TypeDef }> {
    return Method.filterOrigin(methodfn.meta).map((arg) => ({
      name: arg.name.toString(),
      type: getTypeDef(arg.type)
    }));
  }
}

export default withApi(ExtrinsicDisplay);
