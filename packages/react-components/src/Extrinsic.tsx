// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call } from '@polkadot/types/interfaces';
import { CallFunction, TypeDef } from '@polkadot/types/types';
import { BareProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { RawParam } from '@polkadot/react-params/types';

import React from 'react';
import { GenericCall, getTypeDef } from '@polkadot/types';

import { InputExtrinsic } from '@polkadot/react-components';
import Params from '@polkadot/react-params';
import { withApi } from '@polkadot/react-api';
import { isUndefined } from '@polkadot/util';

import paramComponents from './Params';

interface Props extends BareProps, ApiProps {
  defaultValue: CallFunction;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  label?: React.ReactNode;
  onChange: (method?: Call) => void;
  onEnter: () => void;
  withLabel?: boolean;
}

interface State {
  methodfn: CallFunction;
  params: { name: string; type: TypeDef }[];
  values: RawParam[];
}

class ExtrinsicDisplay extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      methodfn: props.defaultValue,
      params: this.getParams(props.defaultValue),
      values: []
    };
  }

  public render (): React.ReactNode {
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

  private nextState (newState: Pick< State, never>): void {
    this.setState(newState, (): void => {
      const { onChange } = this.props;
      const { methodfn, params, values } = this.state;

      const isValid = values.reduce((isValid, value): boolean =>
        isValid &&
        !isUndefined(value) &&
        !isUndefined(value.value) &&
        value.isValid, params.length === values.length
      );

      let method;

      if (isValid) {
        try {
          method = methodfn(
            ...values.map(({ value }): any => value)
          );
        } catch (error) {
          // swallow
        }
      }

      onChange(method);
    });
  }

  private onChangeMethod = (methodfn: CallFunction): void => {
    this.nextState({
      methodfn,
      params: this.getParams(methodfn),
      values: []
    });
  }

  private onChangeValues = (values: RawParam[]): void => {
    this.nextState({ values });
  }

  private getParams (methodfn: CallFunction): { name: string; type: TypeDef }[] {
    return GenericCall.filterOrigin(methodfn.meta).map((arg): { name: string; type: TypeDef } => ({
      name: arg.name.toString(),
      type: getTypeDef(arg.type.toString())
    }));
  }
}

export default withApi(ExtrinsicDisplay);
