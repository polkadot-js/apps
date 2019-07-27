// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractABIFnArg } from '@polkadot/api-contract/types';
import { TypeDef } from '@polkadot/types/types';
import { RawParams } from '@polkadot/ui-params/types';

import React from 'react';
import UIParams from '@polkadot/ui-params';
import { getTypeDef } from '@polkadot/types';

interface Props {
  isDisabled?: boolean;
  params?: ContractABIFnArg[];
  onChange: (values: any[]) => void;
  onEnter?: () => void;
}

interface ParamDef {
  name: string;
  type: TypeDef;
}

interface State {
  params: ParamDef[];
}

export default class Params extends React.PureComponent<Props, State> {
  public state: State = { params: [] };

  public static getDerivedStateFromProps ({ params }: Props): State | null {
    if (!params) {
      return { params: [] };
    }

    return {
      params: params.map(({ name, type }): ParamDef => ({
        name,
        type: getTypeDef(type, name)
      }))
    };
  }

  public render (): React.ReactNode {
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

    onChange(values.map(({ value }): any => value));
  }
}
