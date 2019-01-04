// Copyright 2017-2019 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MethodFunction } from '@polkadot/types/Method';
import { BareProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';
import { RawParam } from '@polkadot/ui-app/Params/types';

import React from 'react';
import { TypeDef, getTypeDef } from '@polkadot/types/codec';
import { Method } from '@polkadot/types';

import { InputExtrinsic, Params } from '@polkadot/ui-app/index';
import { isUndefined } from '@polkadot/util';
import { withApi } from '@polkadot/ui-react-rx/with/index';

import paramComponents from './Params';

type Props = BareProps & ApiProps & {
  defaultValue: MethodFunction,
  isDisabled?: boolean,
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: (method?: Method) => void,
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
          onChange={this.onChangeMethod}
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
      const { methodfn, params, values } = this.state;

      const isValid = values.reduce((isValid, value) =>
          isValid &&
          !isUndefined(value) &&
          !isUndefined(value.value) &&
          value.isValid, params.length === values.length);

      let method;

      if (isValid) {
        try {
          method = methodfn(
            ...values.map(({ value }) =>
              value
            )
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
