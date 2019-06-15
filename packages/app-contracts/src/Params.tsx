// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIFn$Arg } from '@polkadot/api-contract/types';
import { RawParams } from '@polkadot/ui-params/types';

import React from 'react';
import UIParams from '@polkadot/ui-params';
import { getTypeDef, TypeDef } from '@polkadot/types';

type Props = {
  isDisabled?: boolean,
  params?: Array<ContractABIFn$Arg>,
  onChange: (values: Array<any>) => void,
  onEnter?: () => void
};

type State = {
  params: Array<{ name: string, type: TypeDef }>
};

export default class Params extends React.PureComponent<Props, State> {
  state: State = { params: [] };

  static getDerivedStateFromProps ({ params }: Props): State | null {
    if (!params) {
      return { params: [] };
    }

    return {
      params: params.map(({ name, type }) => ({
        name,
        type: getTypeDef(type, name)
      }))
    } as State;
  }

  render () {
    const { isDisabled, onEnter } = this.props;
    const { params } = this.state;

    if (!params.length) {
      return null;
    }

    return (
      <UIParams
        isDisabled={isDisabled}
        onChange={this.onChange}
        onEnter={onEnter}
        params={params}
      />
    );
  }

  private onChange = (values: RawParams): void => {
    const { onChange } = this.props;

    onChange(values.map(({ value }) => value));
  }
}
