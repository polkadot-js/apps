// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import React from 'react';

import BlockHeaders from './BlockHeaders';
import Query from './Query';
import Summary from './Summary';

type Props = BareProps & {
  basePath: string
};

export default class Main extends React.PureComponent<Props> {
  render () {
    return [
      <Summary key='summary' />,
      <Query key='query' />,
      <BlockHeaders key='headers' />
    ];
  }
}
