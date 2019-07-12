// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { isHex } from '@polkadot/util';
import { BlockNumber } from '@polkadot/types';

import Query from '../Query';
import BlockByHash from './ByHash';
import BlockByNumber from './ByNumber';

interface Props extends BareProps {
  chain_bestNumber?: BlockNumber;
  match: {
    params: {
      value: string;
    };
  };
}

interface State {
  value?: string;
}

class Entry extends React.Component<Props, State> {
  public state: State = {
    value: undefined
  };

  public static getDerivedStateFromProps ({ chain_bestNumber, match: { params } }: Props): State {
    let { value } = params;
    if ((!value || !value.length) && chain_bestNumber) {
      value = chain_bestNumber.toString();
    }

    return {
      value
    } as State;
  }

  shouldComponentUpdate (nextProps: Props) {
    return this.props.match !== nextProps.match ||
      !this.state.value;
  }

  public render (): React.ReactNode {
    const { value } = this.state;

    if (!value) {
      return null;
    }

    const Component = isHex(value)
      ? BlockByHash
      : BlockByNumber;

    return (
      <>
        <Query />
        <Component
          key={value}
          value={value}
        />
      </>
    );
  }
}

export default withMulti(
  Entry,
  withCalls<Props>('derive.chain.bestNumber')
);
