// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { isHex } from '@polkadot/util';
import { BlockNumber } from '@polkadot/types';

import BlockByHash from './ByHash';
import BlockByNumber from './ByNumber';
import Query from './Query';

type Props = BareProps & {
  chain_bestNumber?: BlockNumber,
  match: {
    params: {
      value: string
    }
  }
};

type State = {
  value?: string
};

class Entry extends React.Component<Props, State> {
  state: State = {
    value: undefined
  };

  static getDerivedStateFromProps ({ chain_bestNumber, match: { params } }: Props): State {
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

  render () {
    const { value } = this.state;

    return (
      <>
        <Query value={value} />
        {this.renderBlock()}
      </>
    );
  }

  private renderBlock () {
    const { value } = this.state;

    if (!value) {
      return null;
    }

    return isHex(value)
      ? (
        <BlockByHash
          key={value}
          value={value}
        />
      )
      : (
        <BlockByNumber
          key={value}
          value={value}
        />
      );
  }
}

export default withMulti(
  Entry,
  withCalls<Props>('derive.chain.bestNumber')
);
