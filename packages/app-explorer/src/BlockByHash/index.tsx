// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';

import BlockByHash from './BlockByHash';

type Props = BareProps & {
  match: {
    params: {
      hash: string
    }
  }
};

export default class Entry extends React.PureComponent<Props> {
  render () {
    const { match: { params: { hash } } } = this.props;

    if (!hash) {
      return null;
    }

    return (
      <BlockByHash
        key={hash}
        value={hash}
      />
    );
  }
}
