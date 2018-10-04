// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ExtrinsicFunction } from '@polkadot/extrinsics/types';
import { BareProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';
import { RawParam } from '@polkadot/ui-app/Params/types';

import React from 'react';
import { TypeDef, getTypeDef } from '@polkadot/types/codec';
import { UncheckedMortalExtrinsic } from '@polkadot/types';

import InputExtrinsic from '@polkadot/ui-app/InputExtrinsic';
import Params from '@polkadot/ui-app/Params';
import isUndefined from '@polkadot/util/is/undefined';
import withApi from '@polkadot/ui-react-rx/with/api';

import paramComponents from './Params';

type Props = BareProps & ApiProps & {
  defaultValue: ExtrinsicFunction,
  isDisabled?: boolean,
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: (extrinsic?: UncheckedMortalExtrinsic) => void,
  withLabel?: boolean
};

type State = {
  method: ExtrinsicFunction,
  params: Array<{ name: string, type: TypeDef }>,
  values: Array<RawParam>
};

class Extrinsic extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      method: props.defaultValue,
      params: this.getParams(props.defaultValue),
      values: []
    };
  }

  render () {
    const { defaultValue, isDisabled, isError, isPrivate, labelMethod, labelSection, withLabel } = this.props;
    const { params } = this.state;

    return (
      <div className='extrinsics--Extrinsic'>
        <InputExtrinsic
          defaultValue={defaultValue}
          isDisabled={isDisabled}
          isError={isError}
          isPrivate={isPrivate}
          labelMethod={labelMethod}
          labelSection={labelSection}
          onChange={this.onChangeExtrinsic}
          withLabel={withLabel}
        />
        <Params
          onChange={this.onChangeValues}
          overrides={paramComponents}
          params={params}
        />
      </div>
    );
  }

  private nextState (newState: State): void {
    this.setState(newState, () => {
      const { onChange } = this.props;
      const { method, params, values } = this.state;

      const isValid = values.reduce((isValid, value) =>
          isValid &&
          !isUndefined(value) &&
          !isUndefined(value.value) &&
          value.isValid, params.length === values.length);

      let extrinsic;

      if (isValid) {
        try {
          extrinsic = method(
            ...values.map(({ value }) =>
              value
            )
          );
        } catch (error) {
          // swallow
        }
      }

      onChange(extrinsic);
    });
  }

  private onChangeExtrinsic = (method: ExtrinsicFunction): void => {
    this.nextState({
      method,
      params: this.getParams(method),
      values: []
    });
  }

  private onChangeValues = (values: Array<RawParam>): void => {
    this.nextState({ values } as State);
  }

  private getParams (method: ExtrinsicFunction): Array<{ name: string, type: TypeDef }> {
    return method.meta.arguments
      .filter((arg) =>
        arg.type.toString() !== 'Origin'
      )
      .map((arg) => ({
        name: arg.name.toString(),
        type: getTypeDef(arg.type.toString())
      }));
  }
}

export default withApi(Extrinsic);
