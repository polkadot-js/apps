// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import { isHex } from '@polkadot/util';

import BlockByHash from './ByHash';
import BlockByNumber from './ByNumber';
import Query from './Query';

type Props = BareProps & {
  match: {
    params: {
      value: string
    }
  }
};

export default class Entry extends React.PureComponent<Props> {
  render () {
    const { match: { params: { value } } } = this.props;

    return (
      <>
        <Query value={value} />
        {this.renderBlock()}
      </>
    );
  }

  private renderBlock () {
    const { match: { params: { value } } } = this.props;

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
